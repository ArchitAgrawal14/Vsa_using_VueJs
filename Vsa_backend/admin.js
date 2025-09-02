import express from "express";
import PDFDocument from "pdfkit";

const app = express();
app.use(express.json());

export function downloadOnlineSaleList(req, res, saleData) {
  try {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader(
      "Content-disposition",
      `attachment; filename = Vsa_online_sale_data${Date.now()}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");

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
    const tableTop = doc.y + 10;
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

    // Header background
    doc
      .rect(margin, tableTop, pageWidth, headerHeight)
      .fill("#3498db")
      .stroke();

    // Draw table headers with better styling
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#ffffff");

    let currentX = margin;
    doc.text("Email Address", currentX + 5, tableTop + 8, {
      width: colWidths.email - 10,
      align: "left",
    });

    currentX += colWidths.email;
    doc.text("Order ID", currentX + 5, tableTop + 8, {
      width: colWidths.orderId - 10,
      align: "center",
    });

    currentX += colWidths.orderId;
    doc.text("Price", currentX + 5, tableTop + 8, {
      width: colWidths.price - 10,
      align: "center",
    });

    currentX += colWidths.price;
    doc.text("Date", currentX + 5, tableTop + 8, {
      width: colWidths.date - 10,
      align: "center",
    });

    // Draw table rows with better formatting
    saleData.forEach((item, i) => {
      const y = tableTop + headerHeight + i * rowHeight;

      // Check if we need a new page
      if (y + rowHeight > doc.page.height - 100) {
        doc.addPage();
        return; // Skip this row for now - you might want to implement pagination
      }

      // Alternate row colors for better readability
      const fillColor = i % 2 === 0 ? "#ecf0f1" : "#ffffff";

      // Draw row background
      doc
        .rect(margin, y, pageWidth, rowHeight)
        .fill(fillColor)
        .stroke("#bdc3c7");

      // Format price with currency symbol
      const formattedPrice = `$${parseFloat(item.price || 0).toFixed(2)}`;

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

      currentX = margin;

      // Email (truncate if too long)
      const email = item.email || "N/A";
      const truncatedEmail =
        email.length > 35 ? email.substring(0, 32) + "..." : email;
      doc.text(truncatedEmail, currentX + 5, y + 7, {
        width: colWidths.email - 10,
        align: "left",
      });

      currentX += colWidths.email;
      doc.text(item.order_id || "N/A", currentX + 5, y + 7, {
        width: colWidths.orderId - 10,
        align: "center",
      });

      currentX += colWidths.orderId;
      doc
        .font("Helvetica-Bold")
        .fillColor("#27ae60")
        .text(formattedPrice, currentX + 5, y + 7, {
          width: colWidths.price - 10,
          align: "center",
        });

      currentX += colWidths.price;
      doc
        .font("Helvetica")
        .fillColor("#7f8c8d")
        .text(formattedDate, currentX + 5, y + 7, {
          width: colWidths.date - 10,
          align: "center",
        });
    });

    // Calculate and add summary totals
    const totalAmount = saleData.reduce(
      (sum, item) => sum + parseFloat(item.price || 0),
      0
    );
    const summaryY = tableTop + headerHeight + saleData.length * rowHeight + 20;

    // Add total summary
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text(`Total Revenue: $${totalAmount.toFixed(2)}`, margin, summaryY, {
        align: "right",
      });

    // Add footer with better styling
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#95a5a6")
      .text("Generated by VSA Inventory System", 0, doc.page.height - 50, {
        align: "center",
        width: doc.page.width,
      });

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
}

export async function updateAdminPermission(userId, permissionKey, value, connection) {
  try {
    // Input validation
    if (!userId || !permissionKey || (value !== 0 && value !== 1)) {
      throw new Error("Missing or invalid required fields: userId, permissionKey, value");
    }

    const allowedPermissions = [
      'show_order_status', 'show_edit_shop', 'show_edit_achievements',
      'show_invoice_generation', 'show_online_sales', 'show_offline_customers',
      'show_online_users', 'show_available_stocks', 'show_offline_sales',
      'show_send_mails', 'show_new_student', 'show_attendance',
      'show_manage_students', 'show_students_achievements', 
      'show_attendance_records', 'show_news_letter', 'show_manage_admins'
    ];

    if (!allowedPermissions.includes(permissionKey)) {
      throw new Error("Invalid permission key");
    }

    // Check if user exists
    const [user] = await connection.query('SELECT is_admin FROM users WHERE user_id = ?', [userId]);
    if (user.length === 0) {
      throw new Error("User not found");
    }

    // Update the permission
    await connection.query(`UPDATE admin_access SET ${permissionKey} = ? WHERE user_id = ?`, [value, userId]);

    // Count total permissions
    const permissionColumns = allowedPermissions.join(' + ');
    const [permissionCount] = await connection.query(`
      SELECT (${permissionColumns}) AS total_permissions
      FROM admin_access 
      WHERE user_id = ?`, [userId]);

    const totalPermissions = permissionCount[0]?.total_permissions || 0;
    const currentAdminStatus = user[0].is_admin;

    // Update admin status if needed
    if (totalPermissions === 0 && currentAdminStatus === 1) {
      await connection.query('UPDATE users SET is_admin = 0 WHERE user_id = ?', [userId]);
    } else if (totalPermissions > 0 && currentAdminStatus === 0) {
      await connection.query('UPDATE users SET is_admin = 1 WHERE user_id = ?', [userId]);
    }

    return {
      success: true,
      message: "Permission updated successfully",
      data: {
        userId,
        permissionKey,
        value,
        totalPermissions,
        isAdmin: totalPermissions > 0
      }
    };

  } catch (error) {
    throw error; // Re-throw to be handled by the route handler
  }
}
