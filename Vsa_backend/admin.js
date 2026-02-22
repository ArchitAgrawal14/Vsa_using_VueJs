import express from "express";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { Parser } from "json2csv";

const app = express();
app.use(express.json());

export function downloadOnlineSaleList(req, res, saleData) {
  try {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    // Set headers for PDF download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="VSA_Online_Sales_${Date.now()}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Pipe the PDF directly to response
    doc.pipe(res);

    // Add title
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Online Sales Report", { align: "center" })
      .moveDown(0.5);

    // Add subtitle
    doc
      .fontSize(16)
      .font("Helvetica")
      .fillColor("#7f8c8d")
      .text("VSA Inventory System", { align: "center" })
      .moveDown(1);

    // Add date with better formatting
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc
      .fontSize(12)
      .fillColor("#34495e")
      .text(`Generated on: ${currentDate}`, { align: "right" })
      .moveDown(1.5);

    // Add summary
    doc
      .fontSize(12)
      .fillColor("#2c3e50")
      .text(`Total Orders: ${saleData.length}`)
      .moveDown(1);

    // Define improved table settings
    const pageWidth = doc.page.width - 100; // Account for margins
    const colWidths = {
      email: pageWidth * 0.4, // 40% for email
      orderId: pageWidth * 0.25, // 25% for order ID
      price: pageWidth * 0.15, // 15% for price
      date: pageWidth * 0.2, // 20% for date
    };
    const rowHeight = 25;
    const headerHeight = 30;
    const margin = 50;

    // Function to draw table header
    function drawTableHeader(startY) {
      // Header background
      doc
        .rect(margin, startY, pageWidth, headerHeight)
        .fill("#3498db")
        .stroke();

      // Draw table headers
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#ffffff");

      let currentX = margin;
      doc.text("Email Address", currentX + 5, startY + 8, {
        width: colWidths.email - 10,
        align: "left",
      });

      currentX += colWidths.email;
      doc.text("Order ID", currentX + 5, startY + 8, {
        width: colWidths.orderId - 10,
        align: "center",
      });

      currentX += colWidths.orderId;
      doc.text("Price", currentX + 5, startY + 8, {
        width: colWidths.price - 10,
        align: "center",
      });

      currentX += colWidths.price;
      doc.text("Date", currentX + 5, startY + 8, {
        width: colWidths.date - 10,
        align: "center",
      });

      return startY + headerHeight;
    }

    // Draw initial table header
    let tableTop = doc.y + 10;
    let currentY = drawTableHeader(tableTop);

    // Draw table rows with pagination
    saleData.forEach((item, i) => {
      // Check if we need a new page (leaving space for footer)
      if (currentY + rowHeight > doc.page.height - 100) {
        doc.addPage();
        tableTop = 50;
        currentY = drawTableHeader(tableTop);
      }

      // Alternate row colors for better readability
      const fillColor = i % 2 === 0 ? "#ecf0f1" : "#ffffff";

      // Draw row background
      doc
        .rect(margin, currentY, pageWidth, rowHeight)
        .fill(fillColor)
        .stroke("#bdc3c7");

      // Format price with currency symbol
      const formattedPrice = `₹${parseFloat(item.price || 0).toFixed(2)}`;

      // Format date
      const formattedDate = new Date(item.created_at).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

      // Add row data with proper styling
      doc.fontSize(10).font("Helvetica").fillColor("#2c3e50");

      let currentX = margin;

      // Email (truncate if too long)
      const email = item.email || "N/A";
      const truncatedEmail =
        email.length > 35 ? email.substring(0, 32) + "..." : email;
      doc.text(truncatedEmail, currentX + 5, currentY + 7, {
        width: colWidths.email - 10,
        align: "left",
      });

      currentX += colWidths.email;
      doc.text(item.order_id || "N/A", currentX + 5, currentY + 7, {
        width: colWidths.orderId - 10,
        align: "center",
      });

      currentX += colWidths.orderId;
      doc
        .font("Helvetica-Bold")
        .fillColor("#27ae60")
        .text(formattedPrice, currentX + 5, currentY + 7, {
          width: colWidths.price - 10,
          align: "center",
        });

      currentX += colWidths.price;
      doc
        .font("Helvetica")
        .fillColor("#7f8c8d")
        .text(formattedDate, currentX + 5, currentY + 7, {
          width: colWidths.date - 10,
          align: "center",
        });

      currentY += rowHeight;
    });

    // Calculate and add summary totals
    const totalAmount = saleData.reduce(
      (sum, item) => sum + parseFloat(item.price || 0),
      0
    );

    // Check if we need space for summary
    if (currentY + 60 > doc.page.height - 100) {
      doc.addPage();
      currentY = 50;
    }

    currentY += 20;

    // Add total summary
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text(`Total Revenue: ₹${totalAmount.toFixed(2)}`, margin, currentY, {
        align: "right",
      });

    // Add footer on each page
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#95a5a6")
        .text(
          `Generated by VSA Inventory System | Page ${i + 1} of ${range.count}`,
          0,
          doc.page.height - 50,
          {
            align: "center",
            width: doc.page.width,
          }
        );
    }
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating PDF",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download offline users list as PDF
 * @param {Array} userData - Array of user objects
 * @param {Object} res - Express response object
 */
export function downloadOfflineUsersListPDF(userData, res) {
  try {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=offline-users-${Date.now()}.pdf`
    );

    // Pipe the PDF to response
    doc.pipe(res);

    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Offline Users Report", { align: "center" })
      .moveDown();

    // Metadata
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" })
      .text(`Total Users: ${userData.length}`, { align: "right" })
      .moveDown(2);

    // Table headers
    const tableTop = doc.y;
    const colWidths = {
      name: 140,
      mobile: 100,
      whatsapp: 100,
      email: 150,
    };
    const startX = 50;

    // Draw header background
    doc.rect(startX, tableTop, 495, 25).fillAndStroke("#4B5563", "#374151");

    // Header text
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("white")
      .text("Full Name", startX + 5, tableTop + 7, { width: colWidths.name })
      .text("Mobile", startX + colWidths.name + 5, tableTop + 7, {
        width: colWidths.mobile,
      })
      .text(
        "WhatsApp",
        startX + colWidths.name + colWidths.mobile + 5,
        tableTop + 7,
        { width: colWidths.whatsapp }
      )
      .text(
        "Email",
        startX + colWidths.name + colWidths.mobile + colWidths.whatsapp + 5,
        tableTop + 7,
        { width: colWidths.email }
      );

    let currentY = tableTop + 30;

    // Table rows
    doc.fontSize(9).font("Helvetica").fillColor("black");

    userData.forEach((user, index) => {
      // Check if we need a new page
      if (currentY > 720) {
        doc.addPage();
        currentY = 50;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(startX, currentY - 5, 495, 20).fill("#F3F4F6");
        doc.fillColor("black");
      }

      // Row data
      doc
        .text(user.full_name || "N/A", startX + 5, currentY, {
          width: colWidths.name - 10,
          ellipsis: true,
        })
        .text(user.mobile || "N/A", startX + colWidths.name + 5, currentY, {
          width: colWidths.mobile - 10,
        })
        .text(
          user.whatsapp_number || "N/A",
          startX + colWidths.name + colWidths.mobile + 5,
          currentY,
          { width: colWidths.whatsapp - 10 }
        )
        .text(
          user.email || "N/A",
          startX + colWidths.name + colWidths.mobile + colWidths.whatsapp + 5,
          currentY,
          { width: colWidths.email - 10, ellipsis: true }
        );

      currentY += 20;
    });

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("gray")
        .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
          align: "center",
        });
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating PDF",
        error: error.message,
      });
    }
  }
}
/**
 * Generate and download offline users list as CSV
 * @param {Array} userData - Array of user objects
 * @param {Object} res - Express response object
 */
export function downloadOfflineUsersListCSV(userData, res) {
  try {
    // Define CSV fields
    const fields = [
      { label: "Full Name", value: "full_name" },
      { label: "Mobile", value: "mobile" },
      { label: "WhatsApp Number", value: "whatsapp_number" },
      { label: "Email", value: "email" },
    ];

    // Configure parser
    const json2csvParser = new Parser({
      fields,
      header: true,
      defaultValue: "N/A",
    });

    // Convert to CSV
    const csv = json2csvParser.parse(userData);

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=offline-users-${Date.now()}.csv`
    );

    // Send CSV
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating CSV",
        error: error.message,
      });
    }
  }
}

// ... (previous offline user methods) ...

/**
 * Generate and download online users list as PDF
 * @param {Array} userData - Array of user objects
 * @param {Object} res - Express response object
 */
export function downloadOnlineUsersDataPDF(userData, res) {
  try {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=online-users-${Date.now()}.pdf`
    );

    // Pipe the PDF to response
    doc.pipe(res);

    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Online Users Report", { align: "center" })
      .moveDown();

    // Metadata
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" })
      .text(`Total Users: ${userData.length}`, { align: "right" })
      .moveDown(2);

    // Table headers
    const tableTop = doc.y;
    const colWidths = {
      userId: 80,
      name: 160,
      mobile: 110,
      email: 145,
    };
    const startX = 50;

    // Draw header background
    doc.rect(startX, tableTop, 495, 25).fillAndStroke("#3B82F6", "#2563EB");

    // Header text
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("white")
      .text("User ID", startX + 5, tableTop + 7, { width: colWidths.userId })
      .text("Full Name", startX + colWidths.userId + 5, tableTop + 7, {
        width: colWidths.name,
      })
      .text(
        "Mobile",
        startX + colWidths.userId + colWidths.name + 5,
        tableTop + 7,
        { width: colWidths.mobile }
      )
      .text(
        "Email",
        startX + colWidths.userId + colWidths.name + colWidths.mobile + 5,
        tableTop + 7,
        { width: colWidths.email }
      );

    let currentY = tableTop + 30;

    // Table rows
    doc.fontSize(9).font("Helvetica").fillColor("black");

    userData.forEach((user, index) => {
      // Check if we need a new page
      if (currentY > 720) {
        doc.addPage();
        currentY = 50;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(startX, currentY - 5, 495, 20).fill("#EFF6FF");
        doc.fillColor("black");
      }

      // Row data
      doc
        .text(user.id || "N/A", startX + 5, currentY, {
          width: colWidths.userId - 10,
        })
        .text(
          user.full_name || "N/A",
          startX + colWidths.userId + 5,
          currentY,
          { width: colWidths.name - 10, ellipsis: true }
        )
        .text(
          user.mobile || "N/A",
          startX + colWidths.userId + colWidths.name + 5,
          currentY,
          { width: colWidths.mobile - 10 }
        )
        .text(
          user.email || "N/A",
          startX + colWidths.userId + colWidths.name + colWidths.mobile + 5,
          currentY,
          { width: colWidths.email - 10, ellipsis: true }
        );

      currentY += 20;
    });

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("gray")
        .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
          align: "center",
        });
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating PDF",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download online users list as CSV
 * @param {Array} userData - Array of user objects
 * @param {Object} res - Express response object
 */
export function downloadOnlineUsersDataCSV(userData, res) {
  try {
    // Define CSV fields
    const fields = [
      { label: "User ID", value: "id" },
      { label: "Full Name", value: "full_name" },
      { label: "Mobile", value: "mobile" },
      { label: "Email", value: "email" },
    ];

    // Configure parser
    const json2csvParser = new Parser({
      fields,
      header: true,
      defaultValue: "N/A",
    });

    // Convert to CSV
    const csv = json2csvParser.parse(userData);

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=online-users-${Date.now()}.csv`
    );

    // Send CSV
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating CSV",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download available stock list as PDF
 * @param {Array} stockData - Array of stock objects
 * @param {Object} res - Express response object
 */
export function downloadAvailableStockPDF(stockData, res) {
  try {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      layout: "landscape", // Landscape for more columns
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=available-stock-${Date.now()}.pdf`
    );

    // Pipe the PDF to response
    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Available Stock Inventory Report", { align: "center" })
      .moveDown();

    // Metadata
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" })
      .text(`Total Items: ${stockData.length}`, { align: "right" })
      .moveDown(1.5);

    // Calculate totals by category
    const categoryTotals = {};
    stockData.forEach((item) => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
      }
      categoryTotals[item.category] += item.quantity || 0;
    });

    // Display category summary
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Category Summary:", { underline: true })
      .moveDown(0.5);

    doc.fontSize(9).font("Helvetica");
    Object.entries(categoryTotals).forEach(([category, total]) => {
      const formattedCategory = category.replace(/_/g, " ").toUpperCase();
      doc.text(`${formattedCategory}: ${total} units`, { indent: 20 });
    });
    doc.moveDown(1.5);

    // Table headers
    const tableTop = doc.y;
    const colWidths = {
      category: 80,
      itemId: 50,
      name: 110,
      varId: 50,
      color: 60,
      size: 45,
      pack: 45,
      material: 60,
      qty: 45,
      price: 60,
    };
    const startX = 40;

    // Draw header background
    doc.rect(startX, tableTop, 765, 25).fillAndStroke("#059669", "#047857"); // Green theme for inventory

    // Header text
    doc.fontSize(9).font("Helvetica-Bold").fillColor("white");

    let xPos = startX + 5;
    doc.text("Category", xPos, tableTop + 7, {
      width: colWidths.category - 10,
    });
    xPos += colWidths.category;
    doc.text("Item ID", xPos, tableTop + 7, { width: colWidths.itemId - 10 });
    xPos += colWidths.itemId;
    doc.text("Name", xPos, tableTop + 7, { width: colWidths.name - 10 });
    xPos += colWidths.name;
    doc.text("Var ID", xPos, tableTop + 7, { width: colWidths.varId - 10 });
    xPos += colWidths.varId;
    doc.text("Color", xPos, tableTop + 7, { width: colWidths.color - 10 });
    xPos += colWidths.color;
    doc.text("Size", xPos, tableTop + 7, { width: colWidths.size - 10 });
    xPos += colWidths.size;
    doc.text("Pack", xPos, tableTop + 7, { width: colWidths.pack - 10 });
    xPos += colWidths.pack;
    doc.text("Material", xPos, tableTop + 7, {
      width: colWidths.material - 10,
    });
    xPos += colWidths.material;
    doc.text("Qty", xPos, tableTop + 7, { width: colWidths.qty - 10 });
    xPos += colWidths.qty;
    doc.text("Price (₹)", xPos, tableTop + 7, { width: colWidths.price - 10 });

    let currentY = tableTop + 30;

    // Table rows
    doc.fontSize(8).font("Helvetica").fillColor("black");

    stockData.forEach((item, index) => {
      // Check if we need a new page
      if (currentY > 520) {
        doc.addPage();
        currentY = 40;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(startX, currentY - 5, 765, 18).fill("#F0FDF4");
        doc.fillColor("black");
      }

      // Format data
      const category = (item.category || "N/A")
        .replace(/_/g, " ")
        .substring(0, 15);
      const name = (item.name || "N/A").substring(0, 20);
      const color = item.color || "-";
      const size = item.size || "-";
      const packSize = item.pack_size || "-";
      const material = item.material || "-";
      const qty =
        item.quantity !== null && item.quantity !== undefined
          ? item.quantity
          : 0;
      const price = item.current_price
        ? `₹${parseFloat(item.current_price).toFixed(2)}`
        : "-";

      // Row data
      xPos = startX + 5;
      doc.text(category, xPos, currentY, {
        width: colWidths.category - 10,
        ellipsis: true,
      });
      xPos += colWidths.category;
      doc.text(item.item_id || "-", xPos, currentY, {
        width: colWidths.itemId - 10,
      });
      xPos += colWidths.itemId;
      doc.text(name, xPos, currentY, {
        width: colWidths.name - 10,
        ellipsis: true,
      });
      xPos += colWidths.name;
      doc.text(item.item_variation_id || "-", xPos, currentY, {
        width: colWidths.varId - 10,
      });
      xPos += colWidths.varId;
      doc.text(color, xPos, currentY, {
        width: colWidths.color - 10,
        ellipsis: true,
      });
      xPos += colWidths.color;
      doc.text(size, xPos, currentY, { width: colWidths.size - 10 });
      xPos += colWidths.size;
      doc.text(packSize, xPos, currentY, { width: colWidths.pack - 10 });
      xPos += colWidths.pack;
      doc.text(material, xPos, currentY, {
        width: colWidths.material - 10,
        ellipsis: true,
      });
      xPos += colWidths.material;
      doc.text(qty.toString(), xPos, currentY, { width: colWidths.qty - 10 });
      xPos += colWidths.qty;
      doc.text(price, xPos, currentY, { width: colWidths.price - 10 });

      currentY += 18;
    });

    // Footer with page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("gray")
        .text(
          `Page ${i + 1} of ${pageCount} | Available Stock Report`,
          40,
          doc.page.height - 40,
          { align: "center", width: doc.page.width - 80 }
        );
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating PDF",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download available stock list as CSV
 * @param {Array} stockData - Array of stock objects
 * @param {Object} res - Express response object
 */
export function downloadAvailableStockCSV(stockData, res) {
  try {
    // Define CSV fields
    const fields = [
      { label: "Category", value: "category" },
      { label: "Item ID", value: "item_id" },
      { label: "Name", value: "name" },
      { label: "Variation ID", value: "item_variation_id" },
      { label: "Color", value: "color" },
      { label: "Size", value: "size" },
      { label: "Pack Size", value: "pack_size" },
      { label: "Material", value: "material" },
      { label: "Quantity", value: "quantity" },
      { label: "Current Price (₹)", value: "current_price" },
    ];

    // Transform data to format category names
    const formattedData = stockData.map((item) => ({
      ...item,
      category: (item.category || "").replace(/_/g, " ").toUpperCase(),
      quantity:
        item.quantity !== null && item.quantity !== undefined
          ? item.quantity
          : 0,
      current_price: item.current_price
        ? parseFloat(item.current_price).toFixed(2)
        : "",
    }));

    // Configure parser
    const json2csvParser = new Parser({
      fields,
      header: true,
      defaultValue: "-",
    });

    // Convert to CSV
    const csv = json2csvParser.parse(formattedData);

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=available-stock-${Date.now()}.csv`
    );

    // Send CSV
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating CSV",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download offline sales list as PDF
 * @param {Array} saleData - Array of sale objects with line items
 * @param {Object} res - Express response object
 */
export function downloadOfflineSaleListPDF(saleData, res) {
  try {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=offline-sales-${Date.now()}.pdf`
    );

    // Pipe the PDF to response
    doc.pipe(res);

    // Group data by invoice
    const invoiceMap = {};
    saleData.forEach((row) => {
      if (!invoiceMap[row.invoice_number]) {
        invoiceMap[row.invoice_number] = {
          invoice_number: row.invoice_number,
          full_name: row.full_name,
          mobile: row.mobile,
          payment_type: row.payment_type,
          total_amount: row.total_amount,
          discount_applied: row.discount_applied,
          amount_paid: row.amount_paid,
          pending_amount: row.pending_amount,
          created_at: row.created_at,
          items: [],
        };
      }
      invoiceMap[row.invoice_number].items.push({
        item_type: row.item_type,
        item_id: row.item_id,
        item_variation_id: row.item_variation_id,
        quantity: row.quantity,
        price_at_sale: row.price_at_sale,
        line_total: row.line_total,
      });
    });

    const invoices = Object.values(invoiceMap);

    // Title
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Offline Sales Report", { align: "center" })
      .moveDown();

    // Metadata
    const totalRevenue = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.total_amount) || 0),
      0
    );
    const totalPending = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.pending_amount) || 0),
      0
    );

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" })
      .text(`Total Invoices: ${invoices.length}`, { align: "right" })
      .text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, { align: "right" })
      .text(`Total Pending: ₹${totalPending.toFixed(2)}`, { align: "right" })
      .moveDown(2);

    // Process each invoice
    invoices.forEach((invoice, invIndex) => {
      // Check if we need a new page (reserve space for invoice + items)
      const requiredSpace = 120 + invoice.items.length * 18;
      if (doc.y + requiredSpace > 700) {
        doc.addPage();
      }

      // Invoice header background
      const headerY = doc.y;
      doc.rect(50, headerY, 495, 80).fillAndStroke("#7C3AED", "#6D28D9"); // Purple theme for sales

      // Invoice header details
      doc.fontSize(11).font("Helvetica-Bold").fillColor("white");

      doc.text(`Invoice #${invoice.invoice_number}`, 60, headerY + 10);

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(`Customer: ${invoice.full_name || "N/A"}`, 60, headerY + 28)
        .text(`Mobile: ${invoice.mobile || "N/A"}`, 60, headerY + 42)
        .text(
          `Date: ${new Date(invoice.created_at).toLocaleString()}`,
          60,
          headerY + 56
        );

      doc
        .text(`Payment: ${invoice.payment_type || "N/A"}`, 300, headerY + 28)
        .text(
          `Total: ₹${parseFloat(invoice.total_amount || 0).toFixed(2)}`,
          300,
          headerY + 42
        )
        .text(
          `Paid: ₹${parseFloat(invoice.amount_paid || 0).toFixed(2)}`,
          300,
          headerY + 56
        );

      doc
        .text(
          `Discount: ₹${parseFloat(invoice.discount_applied || 0).toFixed(2)}`,
          440,
          headerY + 28
        )
        .text(
          `Pending: ₹${parseFloat(invoice.pending_amount || 0).toFixed(2)}`,
          440,
          headerY + 42
        );

      let currentY = headerY + 90;

      // Items table header
      const itemTableTop = currentY;
      doc.rect(50, itemTableTop, 495, 20).fillAndStroke("#4B5563", "#374151");

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("white")
        .text("Type", 60, itemTableTop + 5, { width: 80 })
        .text("Item ID", 145, itemTableTop + 5, { width: 50 })
        .text("Var ID", 200, itemTableTop + 5, { width: 50 })
        .text("Qty", 255, itemTableTop + 5, { width: 35 })
        .text("Price", 295, itemTableTop + 5, { width: 60 })
        .text("Line Total", 360, itemTableTop + 5, { width: 70 });

      currentY = itemTableTop + 25;

      // Items rows
      doc.fontSize(8).font("Helvetica").fillColor("black");

      invoice.items.forEach((item, itemIndex) => {
        if (itemIndex % 2 === 0) {
          doc.rect(50, currentY - 3, 495, 16).fill("#F3F4F6");
          doc.fillColor("black");
        }

        const itemType = (item.item_type || "N/A").replace(/_/g, " ");

        doc
          .text(itemType, 60, currentY, { width: 80, ellipsis: true })
          .text(item.item_id || "-", 145, currentY, { width: 50 })
          .text(item.item_variation_id || "-", 200, currentY, { width: 50 })
          .text(item.quantity || 0, 255, currentY, { width: 35 })
          .text(
            `₹${parseFloat(item.price_at_sale || 0).toFixed(2)}`,
            295,
            currentY,
            { width: 60 }
          )
          .text(
            `₹${parseFloat(item.line_total || 0).toFixed(2)}`,
            360,
            currentY,
            { width: 70 }
          );

        currentY += 16;
      });

      // Add spacing between invoices
      doc.moveDown(2);
    });

    // Footer with page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("gray")
        .text(
          `Page ${i + 1} of ${pageCount} | Offline Sales Report`,
          50,
          doc.page.height - 50,
          { align: "center", width: 495 }
        );
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating PDF",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download offline sales list as CSV
 * @param {Array} saleData - Array of sale objects with line items
 * @param {Object} res - Express response object
 */
export function downloadOfflineSaleListCSV(saleData, res) {
  try {
    // Define CSV fields (flat structure - one row per line item)
    const fields = [
      { label: "Invoice Number", value: "invoice_number" },
      { label: "Customer Name", value: "full_name" },
      { label: "Mobile", value: "mobile" },
      { label: "Payment Type", value: "payment_type" },
      { label: "Total Amount (₹)", value: "total_amount" },
      { label: "Discount Applied (₹)", value: "discount_applied" },
      { label: "Amount Paid (₹)", value: "amount_paid" },
      { label: "Pending Amount (₹)", value: "pending_amount" },
      { label: "Date", value: "created_at" },
      { label: "Item Type", value: "item_type" },
      { label: "Item ID", value: "item_id" },
      { label: "Variation ID", value: "item_variation_id" },
      { label: "Quantity", value: "quantity" },
      { label: "Price at Sale (₹)", value: "price_at_sale" },
      { label: "Line Total (₹)", value: "line_total" },
    ];

    // Transform data to format values
    const formattedData = saleData.map((item) => ({
      invoice_number: item.invoice_number || "",
      full_name: item.full_name || "N/A",
      mobile: item.mobile || "N/A",
      payment_type: item.payment_type || "N/A",
      total_amount: item.total_amount
        ? parseFloat(item.total_amount).toFixed(2)
        : "0.00",
      discount_applied: item.discount_applied
        ? parseFloat(item.discount_applied).toFixed(2)
        : "0.00",
      amount_paid: item.amount_paid
        ? parseFloat(item.amount_paid).toFixed(2)
        : "0.00",
      pending_amount: item.pending_amount
        ? parseFloat(item.pending_amount).toFixed(2)
        : "0.00",
      created_at: item.created_at
        ? new Date(item.created_at).toLocaleString()
        : "",
      item_type: item.item_type
        ? item.item_type.replace(/_/g, " ").toUpperCase()
        : "N/A",
      item_id: item.item_id || "-",
      item_variation_id: item.item_variation_id || "-",
      quantity: item.quantity || 0,
      price_at_sale: item.price_at_sale
        ? parseFloat(item.price_at_sale).toFixed(2)
        : "0.00",
      line_total: item.line_total
        ? parseFloat(item.line_total).toFixed(2)
        : "0.00",
    }));

    // Configure parser
    const json2csvParser = new Parser({
      fields,
      header: true,
    });

    // Convert to CSV
    const csv = json2csvParser.parse(formattedData);

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=offline-sales-${Date.now()}.csv`
    );

    // Send CSV
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating CSV",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download student fee history as PDF
 * @param {Array} feeHistory - Array of fee payment records
 * @param {Object} res - Express response object
 */
export function downloadFeeHistoryInPdfFormat(feeHistory, res) {
  try {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=student-fee-history-${Date.now()}.pdf`
    );

    // Pipe the PDF to response
    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Student Fee History Report", { align: "center" })
      .moveDown();

    // Metadata
    const totalPaid = feeHistory.reduce(
      (sum, fee) => sum + (parseFloat(fee.amount_paid) || 0),
      0
    );
    const successfulPayments = feeHistory.filter(
      (fee) => fee.status === "success"
    ).length;

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" })
      .text(`Student ID: ${feeHistory[0]?.student_id || "N/A"}`, {
        align: "right",
      })
      .text(`Total Payments: ${feeHistory.length}`, { align: "right" })
      .text(`Successful Payments: ${successfulPayments}`, { align: "right" })
      .text(`Total Amount Paid: ₹${totalPaid.toFixed(2)}`, { align: "right" })
      .moveDown(2);

    // Process each payment record
    feeHistory.forEach((payment, index) => {
      // Check if we need a new page
      const requiredSpace = 100;
      if (doc.y + requiredSpace > 700) {
        doc.addPage();
      }

      // Payment header background
      const headerY = doc.y;
      const bgColor =
        payment.status === "success"
          ? "#10B981"
          : payment.status === "failed"
          ? "#EF4444"
          : "#F59E0B";
      const strokeColor =
        payment.status === "success"
          ? "#059669"
          : payment.status === "failed"
          ? "#DC2626"
          : "#D97706";

      doc.rect(50, headerY, 495, 90).fillAndStroke(bgColor, strokeColor);

      // Payment details
      doc.fontSize(11).font("Helvetica-Bold").fillColor("white");

      doc.text(`Payment #${index + 1}`, 60, headerY + 10);
      doc
        .text(
          `Transaction ID: ${payment.transaction_id || "N/A"}`,
          60,
          headerY + 26
        );

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(`Amount: ₹${parseFloat(payment.amount_paid || 0).toFixed(2)}`, 60, headerY + 44)
        .text(`Payment Mode: ${payment.payment_mode || "N/A"}`, 60, headerY + 58)
        .text(
          `Status: ${(payment.status || "N/A").toUpperCase()}`,
          60,
          headerY + 72
        );

      doc
        .text(
          `Payment Date: ${
            payment.payment_date
              ? new Date(payment.payment_date).toLocaleDateString()
              : "N/A"
          }`,
          300,
          headerY + 44
        )
        .text(
          `Created: ${
            payment.created_at
              ? new Date(payment.created_at).toLocaleString()
              : "N/A"
          }`,
          300,
          headerY + 58
        );

      // Remarks section if exists
      if (payment.remarks) {
        doc.moveDown(0.5);
        const remarksY = headerY + 95;
        doc
          .fontSize(8)
          .font("Helvetica-Bold")
          .fillColor("black")
          .text("Remarks:", 60, remarksY);
        doc
          .fontSize(8)
          .font("Helvetica")
          .text(payment.remarks, 60, remarksY + 12, {
            width: 485,
            align: "left",
          });
      }

      // Add spacing between payments
      doc.moveDown(2);
    });

    // Footer with page numbers
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor("gray")
        .text(
          `Page ${i + 1} of ${pageCount} | Student Fee History Report`,
          50,
          doc.page.height - 50,
          { align: "center", width: 495 }
        );
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating PDF",
        error: error.message,
      });
    }
  }
}

/**
 * Generate and download student fee history as CSV
 * @param {Array} feeHistory - Array of fee payment records
 * @param {Object} res - Express response object
 */
export function downloadFeeHistoryInCsvFormat(feeHistory, res) {
  try {
    // Define CSV fields
    const fields = [
      { label: "ID", value: "id" },
      { label: "Student ID", value: "student_id" },
      { label: "Transaction ID", value: "transaction_id" },
      { label: "Amount Paid (₹)", value: "amount_paid" },
      { label: "Payment Mode", value: "payment_mode" },
      { label: "Status", value: "status" },
      { label: "Payment Date", value: "payment_date" },
      { label: "Remarks", value: "remarks" },
      { label: "Created At", value: "created_at" },
      { label: "Updated At", value: "updated_at" },
    ];

    // Transform data to format values
    const formattedData = feeHistory.map((payment) => ({
      id: payment.id || "",
      student_id: payment.student_id || "N/A",
      transaction_id: payment.transaction_id || "N/A",
      amount_paid: payment.amount_paid
        ? parseFloat(payment.amount_paid).toFixed(2)
        : "0.00",
      payment_mode: payment.payment_mode
        ? payment.payment_mode.replace(/_/g, " ").toUpperCase()
        : "N/A",
      status: payment.status ? payment.status.toUpperCase() : "N/A",
      payment_date: payment.payment_date
        ? new Date(payment.payment_date).toLocaleDateString()
        : "N/A",
      remarks: payment.remarks || "",
      created_at: payment.created_at
        ? new Date(payment.created_at).toLocaleString()
        : "",
      updated_at: payment.updated_at
        ? new Date(payment.updated_at).toLocaleString()
        : "",
    }));

    // Configure parser
    const json2csvParser = new Parser({
      fields,
      header: true,
    });

    // Convert to CSV
    const csv = json2csvParser.parse(formattedData);

    // Set response headers
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=student-fee-history-${Date.now()}.csv`
    );

    // Send CSV
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating CSV",
        error: error.message,
      });
    }
  }
}

export async function updateAdminPermission(userId, permissionKey, value, connection) {
  try {
    // Input validation
    if (!userId || !permissionKey || (value !== 0 && value !== 1)) {
      throw new Error(
        "Missing or invalid required fields: userId, permissionKey, value"
      );
    }

    const allowedPermissions = [
      "show_order_status",
      "show_edit_shop",
      "show_edit_achievements",
      "show_invoice_generation",
      "show_online_sales",
      "show_offline_customers",
      "show_online_users",
      "show_available_stocks",
      "show_offline_sales",
      "show_send_mails",
      "show_new_student",
      "show_attendance",
      "show_manage_students",
      "show_students_achievements",
      "show_attendance_records",
      "show_news_letter",
      "show_manage_admins",
      "show_manage_dashboard",
      "show_manage_policy",
      "show_manage_disciplines",
    ];

    if (!allowedPermissions.includes(permissionKey)) {
      throw new Error("Invalid permission key");
    }

    // Check if user exists
    const [user] = await connection.query(
      "SELECT is_admin FROM users WHERE id = ?",
      [userId]
    );
    if (user.length === 0) {
      throw new Error("User not found");
    }

    // Update the permission
    await connection.query(
      `UPDATE admin_access SET ${permissionKey} = ? WHERE user_id = ?`,
      [value, userId]
    );

    // Count total permissions
    const permissionColumns = allowedPermissions.join(" + ");
    const [permissionCount] = await connection.query(
      `
      SELECT (${permissionColumns}) AS total_permissions
      FROM admin_access 
      WHERE user_id = ?`,
      [userId]
    );

    const totalPermissions = permissionCount[0]?.total_permissions || 0;
    const currentAdminStatus = user[0].is_admin;

    // Update admin status if needed
    if (totalPermissions === 0 && currentAdminStatus === 1) {
      await connection.query(
        "UPDATE users SET is_admin = 0 WHERE id = ?",
        [userId]
      );
    } else if (totalPermissions > 0 && currentAdminStatus === 0) {
      await connection.query(
        "UPDATE users SET is_admin = 1 WHERE id = ?",
        [userId]
      );
    }

    return {
      success: true,
      message: "Permission updated successfully",
      data: {
        userId,
        permissionKey,
        value,
        totalPermissions,
        isAdmin: totalPermissions > 0,
      },
    };
  } catch (error) {
    throw error; // Re-throw to be handled by the route handler
  }
}

export async function registerNewStudent(body, file, connection) {
  const [rows] = await connection.query(
    "SELECT id FROM users WHERE email = ?",
    [body.email]
  );
  let usersUserId = null;

  if (rows.length > 0) {
    usersUserId = rows[0].id;
  }

  const [existingStudent] = await connection.query(
    `SELECT * FROM students 
    WHERE full_name = ? AND father_name = ? AND mother_name = ? AND email = ?`,
    [body.fullName, body.fatherName, body.motherName, body.email]
  );

  if (existingStudent.length > 0) {
    return {
      success: false,
      message: "Student already exists",
    };
  }

  // Handle dob for generateStudentId
  const dobDate = body.dob ? new Date(body.dob) : new Date();
  const studentId = generateStudentId(
    body.fullName?.trim(),
    dobDate,
    body.motherName?.trim()
  );
  const doj = body.dateOfJoining ? new Date(body.dateOfJoining) : new Date();
  const cycleStartDate = body.cycleStartDate
    ? new Date(body.cycleStartDate)
    : new Date();
  let imagePath = null;
  if (file) {
    try {
      const oldPath = file.path;
      const fileExt = path.extname(file.originalname);
      const newFilename = `${studentId}${fileExt}`;
      const newPath = path.join(path.dirname(oldPath), newFilename);

      // Use async version
      await fs.promises.rename(oldPath, newPath);
      imagePath = `/images/students/${newFilename}`;
    } catch (fileError) {
      throw new Error(`Failed to save student image: ${fileError.message}`);
    }
  }

  // Calculate next payment date based on initial payment
  const initialPayment = body.amountPaid || 0;

  // Handle case where feeStructure might be 0 or null
  if (!body.feeStructure || Number(body.feeStructure) <= 0) {
    return {
      success: false,
      message: "Fee structure must be greater than 0",
    };
  }

  const nextPaymentDate = calculateNextPaymentDate(
    cycleStartDate,
    body.feeCycle
  );

  // Calculate pending fee
  const pendingFee = Math.max(0, Number(body.feeStructure) - initialPayment);
  let transportation = 0;
  if (
    body.transportation === true ||
    body.transportation === "true" ||
    body.transportation === 1 ||
    body.transportation === "1"
  ) {
    transportation = 1;
  }

  try {
    // Insert student
    const [studentResult] = await connection.query(
      `
      INSERT INTO students 
      (student_id, users_user_id, img, full_name, father_name, mother_name, email, mobile_number,
       whatsapp_number, dob, class, gender, school_name, hobbies, date_of_joining, student_group, 
       skate_type, fee_structure, fee_cycle, next_payment_date, pending_fee, transportation, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        usersUserId,
        imagePath,
        body.fullName?.trim(),
        body.fatherName?.trim(),
        body.motherName?.trim(),
        body.email,
        body.mobileNumber,
        body.whatsappNumber,
        body.dob,
        body.className,
        body.gender,
        body.schoolName,
        body?.hobbies,
        doj,
        body.studentGroup,
        body.skateType,
        Number(body.feeStructure),
        body.feeCycle,
        nextPaymentDate,
        pendingFee,
        transportation || false,
        "active",
      ]
    );

    // Add address record for the student
    await connection.query(
      `INSERT INTO student_address 
      (student_id, address_line1, address_line2, city, state, postal_code, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        body?.addressLine1 || "", // Handle null values
        body?.addressLine2 || "",
        body.city || "Satna",
        body.state || "Madhya Pradesh",
        body.postalCode || "485001",
        body.country || "Bharat",
      ]
    );

    // If initial payment was made, record it in student_fee table
    if (initialPayment > 0) {
      const remarks = body.remarks || "Initial registration payment";
      await connection.query(
        `
        INSERT INTO student_fee 
        (student_id, amount_paid, remarks, payment_mode, status, payment_date)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          initialPayment,
          remarks,
          body.paymentMode || "cash",
          "success",
          doj.toISOString().split("T")[0],
        ]
      );
    }

    return {
      success: true,
      message: "Student registered successfully",
      data: {
        studentId: studentId,
        nextPaymentDate: nextPaymentDate,
        pendingFee: pendingFee,
      },
    };
  } catch (error) {
    // Don't handle rollback here since it's handled in the API route
    throw error;
  }
}

export function calculateNextPaymentDate(cycleStartDate, feeCycle) {
  const startDate = new Date(cycleStartDate);
  const nextPaymentDate = new Date(startDate);

  switch (feeCycle.toLowerCase()) {
    case "monthly":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      break;

    case "quarterly":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
      break;

    case "half-yearly":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 6);
      break;

    case "yearly":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 11);
      break;

    default:
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }

  // Handle month overflow (31st → last day of month)
  if (nextPaymentDate.getDate() !== startDate.getDate()) {
    nextPaymentDate.setDate(0);
  }

  return nextPaymentDate.toISOString().split("T")[0];
}

export function generateStudentId(fullName, dob, motherName) {
  const studentsFirstTwoLettersOfName = fullName
    ? fullName.substring(0, 2).toUpperCase()
    : "XX";
  const mothersFirstTwoLettersOfName = motherName
    ? motherName.substring(0, 2).toUpperCase()
    : "XX";
  const dobDate = dob instanceof Date ? dob : new Date(dob);

  const day = String(dobDate.getDate()).padStart(2, "0");
  const month = String(dobDate.getMonth() + 1).padStart(2, "0");
  const timestamp = Date.now().toString().slice(-3); // 3 digits
  const random = Math.floor(10 + Math.random() * 90); // 2 digits (10-99)

  const studentId =
    "VSA" +
    studentsFirstTwoLettersOfName +
    day +
    month +
    mothersFirstTwoLettersOfName +
    timestamp +
    random;

  return studentId;
}

// Get all students for attendance records page
export async function getStudentsForAttendanceRecords(db) {
  const [studentDetails] = await db.query(
    `SELECT s.student_id, s.full_name, s.mother_name, s.student_group
    FROM students AS s`
  );

  if (studentDetails.length === 0) {
    return {
      success: false,
      message: "No data found",
      statusCode: 204,
    };
  }

  return {
    success: true,
    studentDetails: studentDetails,
    statusCode: 200,
  };
}

// Get particular student attendance record
export async function getStudentAttendance(db, studentId, month, year) {
  if (!month || !year) {
    return {
      success: false,
      message: "Month and year are required.",
      statusCode: 400,
    };
  }

  try {
    const [attendanceDetails] = await db.query(
      `
      SELECT *
      FROM students_attendance
      WHERE student_id = ?
        AND MONTH(attendance_date) = ?
        AND YEAR(attendance_date) = ?
      ORDER BY attendance_date ASC
      `,
      [studentId, month, year]
    );

    if (attendanceDetails.length === 0) {
      return {
        success: false,
        message: "No attendance records found for the selected month and year.",
        statusCode: 404,
      };
    }

    const downloadResult = await downloadStudentAttendance(
      attendanceDetails,
      studentId,
      month,
      year
    );

    if (!downloadResult.success) {
      return {
        success: true,
        message: "Attendance records retrieved successfully, but file generation failed.",
        count: attendanceDetails.length,
        attendanceDetails,
        files: null,
        statusCode: 200,
      };
    }

    return {
      success: true,
      message: "Attendance records retrieved successfully.",
      count: attendanceDetails.length,
      attendanceDetails,
      files: downloadResult.files,
      statusCode: 200,
    };
    
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      success: false,
      message: "Internal server error. Please try again later.",
      statusCode: 500,
    };
  }
}

async function downloadStudentAttendance(attendanceDetails, studentId, month, year) {
  try {
    const pdf = await generateAttendancePDF(attendanceDetails, studentId, month, year);
    const csv = await generateAttendanceCSV(attendanceDetails, studentId, month, year);

    return {
      success: true,
      message: "Files generated successfully.",
      files: {
        pdf: pdf.toString('base64'),
        csv: csv.toString('base64')
      },
      statusCode: 200
    };
  } catch (error) {
    console.error("Error generating files:", error);
    return {
      success: false,
      message: "Failed to generate download files.",
      statusCode: 500
    };
  }
}

// Generate PDF for student attendance
async function generateAttendancePDF(attendanceDetails, studentId, month, year) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Student Attendance Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Student ID: ${studentId}`);
      doc.text(`Month: ${month}/${year}`);
      doc.text(`Total Records: ${attendanceDetails.length}`);
      doc.moveDown();

      // Calculate summary
      const summary = {
        present: 0,
        absent: 0,
        sick: 0
      };
      attendanceDetails.forEach(record => {
        if (record.status === 'Present') summary.present++;
        else if (record.status === 'Absent') summary.absent++;
        else if (record.status === 'Sick') summary.sick++;
      });

      // Summary section
      doc.fontSize(11).font('Helvetica-Bold').text('Summary:', { underline: true });
      doc.fontSize(10).font('Helvetica');
      doc.text(`Present: ${summary.present}  |  Absent: ${summary.absent}  |  Sick: ${summary.sick}`);
      doc.moveDown();

      // Table Header
      const tableTop = doc.y;
      const colWidths = { date: 120, status: 100, markedBy: 150 };
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Date', 50, tableTop, { width: colWidths.date });
      doc.text('Status', 170, tableTop, { width: colWidths.status });
      doc.text('Marked By', 270, tableTop, { width: colWidths.markedBy });
      
      doc.moveTo(50, tableTop + 15).lineTo(520, tableTop + 15).stroke();
      
      // Table Rows
      let y = tableTop + 25;
      doc.font('Helvetica');
      
      attendanceDetails.forEach((record, i) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }

        const date = new Date(record.attendance_date).toLocaleDateString();
        doc.text(date, 50, y, { width: colWidths.date });
        doc.text(record.status || 'N/A', 170, y, { width: colWidths.status });
        doc.text(record.marked_by || '-', 270, y, { width: colWidths.markedBy });
        
        y += 20;
        
        if (i < attendanceDetails.length - 1) {
          doc.moveTo(50, y - 5).lineTo(520, y - 5).stroke();
        }
      });

      // Footer
      doc.fontSize(8).text(
        `Generated on ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Generate CSV for student attendance
async function generateAttendanceCSV(attendanceDetails, studentId, month, year) {
  try {
    const fields = [
      { label: 'Student ID', value: 'student_id' },
      { label: 'Date', value: 'attendance_date' },
      { label: 'Status', value: 'status' },
      { label: 'Marked By', value: 'marked_by' },
      { label: 'Time', value: 'created_at' }
    ];

    const formattedData = attendanceDetails.map(record => ({
      student_id: studentId,
      attendance_date: new Date(record.attendance_date).toLocaleDateString(),
      status: record.status || 'N/A',
      marked_by: record.marked_by || '-',
      created_at: record.created_at ? new Date(record.created_at).toLocaleTimeString() : '-'
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(formattedData);
    
    return Buffer.from(csv, 'utf-8');
  } catch (error) {
    throw new Error(`CSV generation failed: ${error.message}`);
  }
}

// Validate the images assest keys while updating dashboard images
export async function validateImageAssetKeys(assetKeys) {
  if (!Array.isArray(assetKeys) || assetKeys.length === 0) {
    throw new Error("assetKeys must be a non-empty array");
  }

  const validAssestkeysForImages = [
    "logo_image",
    "hero_image",
    "skate_icon",
    "check_icon",
    "roller_skate_image",
    "ice_skate_image",
    "skating_banner",
    "roller_speed_image",
    "roller_icon",
    "ice_icon",
  ];

  for (const assetKey of assetKeysArray) {
    if (!validAssestkeysForImages.includes(assetKey)) {
      throw new Error(`Invalid image asset key: " ${assetKey}`);
    }
  }
}

// Function to update dashboard images
export async function updatedDashboardImages(files, connection) {
  let updatedCount = 0;
  for (const key of Object.keys(files)) {
    const file = files[key][0];
    const filePath = "/images/students/" + file.filename;
    const [result] = await connection.query(
      "UPDATE dashboard_image_assets SET asset_path = ? WHERE asset_key = ?",
      [filePath, key]
    );
    updatedCount += result.affectedRows;
  }

  if (updatedCount === Object.keys(files).length) {
    return {
      success: true,
      message: "Dashboard images updated successfully",
    };
  }

  return {
    success: false,
    message: "Some images could not be updated",
  };
}

// Function to update the stats in dasboard
export async function updateStats(req, connection) {
  let updatedCount = 0;
  let expectedUpdates = 0;
  const valueMap = req.body.values ? JSON.parse(req.body.values) : {};
  const statsLabel = [
    "Active_Students",
    "Expert_Coaches",
    "Championships_Won",
    "Years_Experience",
  ];

  for (const label of statsLabel) {
    const newValue = valueMap[label];
    const newImage = req.files[label]?.[0];
    const dbLabel = label.replace(/_/g, " ");
    if (!newValue && !newImage) continue;
    expectedUpdates++;
    let query = "UPDATE dashboard_stats_data SET ";
    const params = [];

    if (newImage) {
      query += "image = ?, ";
      params.push("/images/students/" + newImage.filename);
    }

    if (newValue) {
      query += "value = ?, ";
      params.push(newValue);
    }

    query = query.slice(0, -2);

    query += " WHERE label = ?";
    params.push(dbLabel);

    const [result] = await connection.query(query, params);
    updatedCount += result.affectedRows;
  }
  if (expectedUpdates === 0) {
    return {
      success: false,
      message: "No updates provided",
    };
  }
  if (updatedCount !== expectedUpdates) {
    return {
      success: false,
      message: `Only ${updatedCount} of ${expectedUpdates} stats were updated`,
    };
  }

  return {
    success: true,
    message: "Dashboard stats updated successfully",
    updated: updatedCount,
  };
}

// Function to update dashboard schedule
export async function updateSchedule(connection, allSchedule) {
  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const validDisciplines = ["Roller Skating", "Ice Skating", "Roll Ball"];

  let updatedCount = 0;

  for (const schedule of allSchedule) {
    if (!schedule.day?.trim() || !schedule.discipline?.trim()) {
      return {
        success: false,
        message: "Day and discipline are required",
      };
    }

    // Validate day
    if (!validDays.includes(schedule.day)) {
      return {
        success: false,
        message: `Invalid day: ${schedule.day}`,
      };
    }

    // Validate discipline
    if (!validDisciplines.includes(schedule.discipline)) {
      return {
        success: false,
        message: `Invalid discipline: ${schedule.discipline}`,
      };
    }

    // Ensure at least one field to update
    if (!schedule.level && !schedule.time && !schedule.duration) {
      continue;
    }

    let query = "UPDATE dashboard_schedule_data SET ";
    const params = [];

    if (schedule.level) {
      query += "level = ?, ";
      params.push(schedule.level);
    }
    if (schedule.time) {
      query += "time = ?, ";
      params.push(schedule.time);
    }
    if (schedule.duration) {
      query += "duration = ?, ";
      params.push(schedule.duration);
    }

    query = query.trim().replace(/,\s*$/, "");

    query += " WHERE day = ? AND discipline = ?";
    params.push(schedule.day, schedule.discipline);

    const [result] = await connection.query(query, params);
    updatedCount += result.affectedRows;
  }

  return {
    success: true,
    message: "Schedule updated successfully",
    updatedRows: updatedCount,
  };
}

// Function to update programs
export async function updatePrograms(connection, updatedProgramsData) {
  let updatedCount = 0;

  for (const program of updatedProgramsData) {
    if (!program.id) {
      return {
        success: false,
        message: "Program ID is required for updating",
      };
    }

    // See if at least one field is updated
    if (
      !program.title &&
      !program.category &&
      !program.description &&
      !program.price &&
      !program.feeCycle
    ) {
      continue;
    }
    if (program.price !== undefined && program.price < 0) {
      return {
        success: false,
        message: "Price cannot be negative",
      };
    }
    let query = "UPDATE dashboard_programs_data SET ";
    const params = [];

    if (program.title) {
      query += "title = ?, ";
      params.push(program.title);
    }

    if (program.category) {
      query += "category = ?, ";
      params.push(program.category);
    }

    if (program.description) {
      query += "description = ?, ";
      params.push(program.description);
    }

    if (program.price) {
      query += "price = ?, ";
      params.push(program.price);
    }

    if (program.feeCycle) {
      query += "fee_cycle = ?, ";
      params.push(program.feeCycle);
    }

    // Remove trailing comma
    query = query.trim().replace(/,\s*$/, "");

    query += " WHERE id = ?";
    params.push(program.id);

    const [result] = await connection.query(query, params);
    updatedCount += result.affectedRows;
  }
  return {
    success: true,
    message: "Programs updated successfully",
    updatedRows: updatedCount,
  };
}

// Function to update coaches
export async function updateCoaches(connection, updatedCoachesData) {
  let updatedRows = 0;
  for (const coach of updatedCoachesData) {
    if (!coach.id) {
      return {
        success: false,
        message: "Coach ID is required for updating",
      };
    }
    // See if at least one field is updated
    if (!coach.name && !coach.specialization && !coach.experience) {
      continue;
    }

    // Building query
    let query = "UPDATE dashboard_coaches_data SET ";
    const params = [];

    if (coach.name) {
      query += "name = ?, ";
      params.push(coach.name);
    }

    if (coach.specialization) {
      query += "specialization = ?, ";
      params.push(coach.specialization);
    }

    if (coach.experience) {
      query += "experience = ?, ";
      params.push(coach.experience);
    }

    // Remove trailing comma
    query = query.trim().replace(/,\s*$/, "");

    query += " WHERE id = ?";
    params.push(coach.id);
    const [result] = await connection.query(query, params);
    updatedRows += result.affectedRows;
    if (coach.experience) {
      await connection.query(`UPDATE coaches SET experience = ? WHERE id = ?`, [
        coach.experience,
        coach.id,
      ]);
    }
  }
  return {
    success: true,
    message: "Coaches data updated successfully",
    updatedRows: updatedRows,
  };
}

// Function to calculate and update pending fees in students table when admin open ManageStundets.vue page
export async function calculateAndUpdatePendingStudentsFees(connection) {
  try {
    await connection.beginTransaction();

    const [affectedStudents] = await connection.query(`
      SELECT 
        student_id,
        COALESCE(pending_fee, 0) as old_pending_fee,
        COALESCE(fee_structure, 0) as fee_structure,
        fee_cycle,
        next_payment_date,
        CASE
          WHEN LOWER(TRIM(fee_cycle)) = 'monthly' THEN 
            TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) + 1
          WHEN LOWER(TRIM(fee_cycle)) = 'quarterly' THEN 
            FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 3) + 1
          WHEN LOWER(TRIM(fee_cycle)) = 'half-yearly' THEN 
            FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 6) + 1
          WHEN LOWER(TRIM(fee_cycle)) = 'yearly' THEN 
            FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 11) + 1
          ELSE 1
        END as cycles_missed
      FROM students
      WHERE next_payment_date <= CURDATE() 
        AND status = 'active'
        AND COALESCE(fee_structure, 0) > 0
    `);

    if (affectedStudents.length === 0) {
      await connection.commit();
      console.log(
        `✅ [${new Date().toISOString()}] No students require fee updates`
      );
      return {
        success: true,
        studentsUpdated: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const [result] = await connection.query(`
      UPDATE students
      SET 
        pending_fee = COALESCE(pending_fee, 0) + (
          COALESCE(fee_structure, 0) * (
            CASE
              WHEN LOWER(TRIM(fee_cycle)) = 'monthly' THEN 
                TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) + 1
              WHEN LOWER(TRIM(fee_cycle)) = 'quarterly' THEN 
                FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 3) + 1
              WHEN LOWER(TRIM(fee_cycle)) = 'half-yearly' THEN 
                FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 6) + 1
              WHEN LOWER(TRIM(fee_cycle)) = 'yearly' THEN 
                FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 11) + 1
              ELSE 1
            END
          )
        ),
        next_payment_date = CASE
          WHEN LOWER(TRIM(fee_cycle)) = 'monthly' THEN 
            DATE_ADD(next_payment_date, INTERVAL 
              (TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) + 1) MONTH)
          WHEN LOWER(TRIM(fee_cycle)) = 'quarterly' THEN 
            DATE_ADD(next_payment_date, INTERVAL 
              (FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 3) + 1) * 3 MONTH)
          WHEN LOWER(TRIM(fee_cycle)) = 'half-yearly' THEN 
            DATE_ADD(next_payment_date, INTERVAL 
              (FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 6) + 1) * 6 MONTH)
          WHEN LOWER(TRIM(fee_cycle)) = 'yearly' THEN 
            DATE_ADD(next_payment_date, INTERVAL 
              (FLOOR(TIMESTAMPDIFF(MONTH, next_payment_date, CURDATE()) / 11) + 1) * 11 MONTH)
          ELSE next_payment_date
        END,
        updated_at = NOW()
      WHERE next_payment_date <= CURDATE() 
        AND status = 'active'
        AND COALESCE(fee_structure, 0) > 0
    `);

    if (affectedStudents.length > 0) {
      const logValues = affectedStudents.map((student) => {
        const feeAdded = student.fee_structure * student.cycles_missed;
        return [
          student.student_id,
          student.old_pending_fee,
          student.old_pending_fee + feeAdded,
          feeAdded,
          student.cycles_missed,
          student.fee_cycle,
          "AUTO_UPDATE_BY_CRON",
        ];
      });

      await connection.query(
        `INSERT INTO student_fee_auto_update_log 
        (student_id, old_pending_fee, new_pending_fee, fee_added, cycles_missed, fee_cycle, trigger_type)
        VALUES ?`,
        [logValues]
      );
    }

    await connection.commit();

    const timestamp = new Date().toISOString();
    console.log(
      `✅ [${timestamp}] Pending fees updated for ${result.affectedRows} students`
    );

    return {
      success: true,
      studentsUpdated: result.affectedRows,
      timestamp,
    };
  } catch (error) {
    await connection.rollback();
    console.error("❌ Failed to update pending fees:", error);
    throw error;
  }
}

/**
 * Generate fee receipt PDF and send email notification to student
 * @param {Object} student - Student object from database
 * @param {Number} pending_fee - Pending fee amount (optional)
 * @param {Number} amount_paid - Amount paid (optional)
 * @param {Object} transporter - Nodemailer transporter object
 */
export async function generateAdminReceiptAndNotifyUser(student, pending_fee, amount_paid, transporter) {
  try {
    // Create PDF document
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    // Create a buffer to store PDF
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Generate PDF content
    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Header with school/academy name
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#4F46E5")
      .text("VSA - Fee Receipt", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("gray")
      .text(`Date: ${currentDate}`, { align: "center" })
      .moveDown(2);

    // Student Information Section
    const infoStartY = doc.y;
    doc
      .rect(50, infoStartY, 495, 40)
      .fillAndStroke("#EEF2FF", "#C7D2FE");

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#4F46E5")
      .text("Student Information", 60, infoStartY + 12);

    doc.moveDown(1.5);

    // Student details in two columns
    const leftColumnX = 60;
    const rightColumnX = 320;
    let currentY = doc.y;

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("black")
      .text("Student ID:", leftColumnX, currentY);
    doc
      .font("Helvetica")
      .text(student.student_id || "N/A", leftColumnX + 90, currentY);

    doc
      .font("Helvetica-Bold")
      .text("Mobile:", rightColumnX, currentY);
    doc
      .font("Helvetica")
      .text(student.mobile_number || "N/A", rightColumnX + 90, currentY);

    currentY += 20;
    doc
      .font("Helvetica-Bold")
      .text("Name:", leftColumnX, currentY);
    doc
      .font("Helvetica")
      .text(student.full_name || "N/A", leftColumnX + 90, currentY, {
        width: 200,
      });

    doc
      .font("Helvetica-Bold")
      .text("Email:", rightColumnX, currentY);
    doc
      .font("Helvetica")
      .text(student.email || "N/A", rightColumnX + 90, currentY, {
        width: 200,
      });

    currentY += 20;
    doc
      .font("Helvetica-Bold")
      .text("Father's Name:", leftColumnX, currentY);
    doc
      .font("Helvetica")
      .text(student.father_name || "N/A", leftColumnX + 90, currentY, {
        width: 200,
      });

    // doc
    //   .font("Helvetica-Bold")
    //   .text("Class:", rightColumnX, currentY);
    // doc
    //   .font("Helvetica")
    //   .text(student.class || "N/A", rightColumnX + 90, currentY);

    currentY += 20;
    doc
      .font("Helvetica-Bold")
      .text("Mother's Name:", leftColumnX, currentY);
    doc
      .font("Helvetica")
      .text(student.mother_name || "N/A", leftColumnX + 90, currentY, {
        width: 200,
      });

    doc.moveDown(3);

    // Fee Details Section
    const feeStartY = doc.y;
    doc
      .rect(50, feeStartY, 495, 40)
      .fillAndStroke("#FEF3C7", "#FDE68A");

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#92400E")
      .text("Fee Details", 60, feeStartY + 12);

    doc.moveDown(1.5);

    // Fee information table
    const tableTop = doc.y;
    const itemHeight = 35;
    let rowY = tableTop;

    // Table header
    doc
      .rect(50, rowY, 495, 30)
      .fillAndStroke("#4F46E5", "#4338CA");

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("white")
      .text("Description", 70, rowY + 8, { width: 250 })
      .text("Amount (₹)", 400, rowY + 8, { width: 120, align: "right" });

    rowY += 30;

    // Display amount paid if provided
    if (amount_paid !== undefined && amount_paid !== null) {
      doc
        .rect(50, rowY, 495, itemHeight)
        .fillAndStroke("#F0FDF4", "#BBF7D0");

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("black")
        .text("Amount Paid", 70, rowY + 10, { width: 250 })
        .font("Helvetica-Bold")
        .fillColor("#16A34A")
        .text(`₹ ${parseFloat(amount_paid).toFixed(2)}`, 400, rowY + 10, {
          width: 120,
          align: "right",
        });

      rowY += itemHeight;
    }

    // Display pending fee if provided
    if (pending_fee !== undefined && pending_fee !== null) {
      doc
        .rect(50, rowY, 495, itemHeight)
        .fillAndStroke("#FEF2F2", "#FECACA");

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("black")
        .text("Pending Fee", 70, rowY + 10, { width: 250 })
        .font("Helvetica-Bold")
        .fillColor("#DC2626")
        .text(`₹ ${parseFloat(pending_fee).toFixed(2)}`, 400, rowY + 10, {
          width: 120,
          align: "right",
        });

      rowY += itemHeight;
    }

    // Add total if both values are present
    if (
      amount_paid !== undefined &&
      amount_paid !== null &&
      pending_fee !== undefined &&
      pending_fee !== null
    ) {
      const total = parseFloat(amount_paid) + parseFloat(pending_fee);

      doc
        .rect(50, rowY, 495, itemHeight)
        .fillAndStroke("#EEF2FF", "#C7D2FE");

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("black")
        .text("Total Fee", 70, rowY + 10, { width: 250 })
        .fillColor("#4F46E5")
        .text(`₹ ${total.toFixed(2)}`, 400, rowY + 10, {
          width: 120,
          align: "right",
        });
    }

    doc.moveDown(4);

    // Footer note
    doc
      .fontSize(9)
      .font("Helvetica-Oblique")
      .fillColor("gray")
      .text(
        "This is a computer-generated receipt. For any queries, please contact us at info@vaibhavskatingacademy.com OR Mobile no. - 9752869938, 9301139998.",
        50,
        doc.page.height - 100,
        { align: "center", width: 495 }
      );

    doc
      .fontSize(8)
      .text(
        `Generated on: ${new Date().toLocaleString("en-IN")}`,
        50,
        doc.page.height - 70,
        { align: "center", width: 495 }
      );

    // Finalize PDF
    doc.end();

    // Wait for PDF to be fully generated
    await new Promise((resolve, reject) => {
      doc.on("end", resolve);
      doc.on("error", reject);
    });

    const pdfBuffer = Buffer.concat(chunks);

    // Prepare email content
    let emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">VSA - Fee Receipt</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="color: #374151; font-size: 16px;">Dear ${
            student.full_name
          },</p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            This is to acknowledge the fee transaction for <strong>Student ID: ${
              student.student_id
            }</strong>.
          </p>
          
          <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Fee Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
    `;

    if (amount_paid !== undefined && amount_paid !== null) {
      emailBody += `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #374151;">Amount Paid:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #16A34A; font-weight: bold;">₹ ${parseFloat(
                  amount_paid
                ).toFixed(2)}</td>
              </tr>
      `;
    }

    if (pending_fee !== undefined && pending_fee !== null) {
      emailBody += `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #374151;">Pending Fee:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; color: #DC2626; font-weight: bold;">₹ ${parseFloat(
                  pending_fee
                ).toFixed(2)}</td>
              </tr>
      `;
    }

    emailBody += `
            </table>
          </div>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Please find the detailed fee receipt attached with this email.
          </p>
          
          <p style="color: #6B7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            If you have any questions regarding this receipt, please contact us at info@vaibhavskatingacademy.com OR Mobile no. - 9752869938, 9301139998
          </p>
          
          <p style="color: #6B7280; font-size: 12px;">
            Best regards,<br>
            <strong>Team VSA</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL_VALIDATOR_EMAIL,
      to: student.email,
      subject: `VSA - Fee Receipt for ${student.full_name} (${student.student_id})`,
      html: emailBody,
      attachments: [
        {
          filename: `fee-receipt-${student.student_id}-${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Fee receipt email sent successfully:", info.messageId);

    return {
      success: true,
      message: "Fee receipt generated and email sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error generating receipt and sending email:", error);
    throw new Error(
      `Failed to generate receipt and send email: ${error.message}`
    );
  }
}