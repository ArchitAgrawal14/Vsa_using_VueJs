import express from "express";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

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

export async function registerNewStudent(body, file ,connection) {
  const [existingUsersChild] = await connection.query('SELECT * FROM users WHERE email = ?', [body.email]);
  let usersUserId = null;

  if (existingUsersChild.length > 0) {
    usersUserId = existingUsersChild[0].user_id;
  }

  const [existingStudent] = await connection.query(
    `SELECT * FROM students 
    WHERE full_name = ? AND father_name = ? AND mother_name = ? AND email = ?`,
    [body.fullName, body.fatherName, body.motherName, body.email]
  );

  if (existingStudent.length > 0) {
    return {
      success: false,
      message: 'Student already exists'
    }
  }

  // Fix: Handle dob properly for generateStudentId
  const dobDate = body.dob ? new Date(body.dob) : new Date();
  const studentId = generateStudentId(body.fullName, dobDate, body.motherName);
  const doj = body.dateOfJoining ? new Date(body.dateOfJoining) : new Date();
  let imagePath = null;
  if (file) {
    // Rename file to include studentId
    const oldPath = file.path;
    const fileExt = path.extname(file.originalname);
    const newFilename = `${studentId}${fileExt}`;
    const newPath = path.join(path.dirname(oldPath), newFilename);
    // Rename the file
    fs.renameSync(oldPath, newPath);
    imagePath = `/images/students/${newFilename}`;
  }

  // Calculate next payment date based on initial payment
  const initialPayment = body.amountPaid || 0;
  
  // Fix: Handle case where feeStructure might be 0 or null
  if (!body.feeStructure || body.feeStructure <= 0) {
    return {
      success: false,
      message: 'Fee structure must be greater than 0'
    };
  }

  const nextPaymentDate = calculateNextPaymentDate(
    doj, 
    body.feeCycle, 
    body.feeStructure, 
    initialPayment
  );
  
  // Calculate pending fee
  const pendingFee = Math.max(0, body.feeStructure - initialPayment);
  let transportation = 0;
  if(body.transportation === true) {
    transportation = 1;
  }
  
  try {
    // Insert student
    const [studentResult] = await connection.query(`
      INSERT INTO students 
      (student_id, users_user_id, img, full_name, father_name, mother_name, email, mobile_number,
       whatsapp_number, dob, class, gender, school_name, hobbies, date_of_joining, student_group, 
       skate_type, fee_structure, fee_cycle, next_payment_date, pending_fee, transportation, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentId, usersUserId, imagePath, body.fullName, body.fatherName, body.motherName,
       body.email, body.mobileNumber, body.whatsappNumber, body.dob, body.className, body.gender, 
       body.schoolName, body?.hobbies, doj, body.studentGroup, body.skateType, body.feeStructure, 
       body.feeCycle, nextPaymentDate, pendingFee, transportation || false, 'active']
    );

    // Add address record for the student
    await connection.query(
      `INSERT INTO student_address 
      (student_id, address_line1, address_line2, city, state, postal_code, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        body?.addressLine1 || '', // Handle null values
        body?.addressLine2 || '',
        body.city || 'Satna',
        body.state || 'Madhya Pradesh',
        body.postalCode || '485001',
        body.country || 'Bharat'
      ]
    );
      
    // If initial payment was made, record it in student_fee table
    if (initialPayment > 0) {
      const remarks = body.remarks || 'Initial registration payment';
      await connection.query(`
        INSERT INTO student_fee 
        (student_id, amount_paid, remarks, payment_mode, status, payment_date)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [studentId, initialPayment, remarks, body.paymentMode || 'cash', 'success', doj.toISOString().split('T')[0]]
      );
    }

    return {
      success: true,
      message: 'Student registered successfully',
      data: {
        studentId: studentId,
        nextPaymentDate: nextPaymentDate,
        pendingFee: pendingFee
      }
    };

  } catch (error) {
    // Don't handle rollback here since it's handled in the API route
    throw error;
  }
}

function calculateNextPaymentDate(dateOfJoining, feeCycle, feeStructure, amountPaid) {
  const doj = new Date(dateOfJoining);
  
  if (amountPaid >= feeStructure) {
    let nextPaymentDate = new Date(doj);
    
    switch(feeCycle.toLowerCase()) {
      case 'monthly':
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
        break;
      case 'half-yearly':
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 6);
        break;
      case 'yearly':
        nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
        break;
      default:
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    
    return nextPaymentDate.toISOString().split('T')[0];
  }
  
  // Calculate how much of the cycle period is covered by the amount paid
  const coverageRatio = amountPaid / feeStructure;
  
  let nextPaymentDate = new Date(doj);
  
  switch(feeCycle.toLowerCase()) {
    case 'monthly':
      // Add days based on coverage ratio for monthly
      const daysInMonth = new Date(doj.getFullYear(), doj.getMonth() + 1, 0).getDate();
      const additionalDays = Math.floor(coverageRatio * daysInMonth);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + additionalDays);
      break;
      
    case 'quarterly':
      // Add days based on coverage ratio (quarterly = ~90 days)
      const quarterlyDays = Math.floor(coverageRatio * 90);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + quarterlyDays);
      break;
      
    case 'half-yearly':
      // Add days based on coverage ratio (half-yearly = ~180 days)
      const halfYearlyDays = Math.floor(coverageRatio * 180);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + halfYearlyDays);
      break;
      
    case 'yearly':
      // Add days based on coverage ratio (yearly = 365 days)
      const yearlyDays = Math.floor(coverageRatio * 365);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + yearlyDays);
      break;
      
    default:
      // Default to monthly if cycle is not recognized
      const defaultDaysInMonth = new Date(doj.getFullYear(), doj.getMonth() + 1, 0).getDate();
      const defaultAdditionalDays = Math.floor(coverageRatio * defaultDaysInMonth);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + defaultAdditionalDays);
  }
  
  return nextPaymentDate.toISOString().split('T')[0];
}

function generateStudentId(fullName, dob, motherName) {
  const studentsFirstTwoLettersOfName = fullName ? fullName.substring(0, 2).toUpperCase() : "XX";
  const mothersFirstTwoLettersOfName = motherName ? motherName.substring(0, 2).toUpperCase() : "XX";
  const dobDate = dob instanceof Date ? dob : new Date(dob);
  
  const day = String(dobDate.getDate()).padStart(2, "0");
  const month = String(dobDate.getMonth() + 1).padStart(2, "0");

  const studentId = 'VSA' + studentsFirstTwoLettersOfName + day + month + mothersFirstTwoLettersOfName;

  return studentId;
}