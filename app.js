async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const studentName = document.getElementById('name').value;
    const rollNo = document.getElementById('rollno').value;
    const fatherName = document.getElementById('fathername').value;
    const courseName = document.getElementById('course').value;
    const department = document.getElementById('department').value;
    const academicYear = document.getElementById('academicyear').value;
    const dob = document.getElementById('dob').value;
    const purpose = document.getElementById('purpose').value;
    const conduct = document.getElementById('conduct').value;
    const issueDate = new Date().toLocaleDateString();

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    doc.setFontSize(16);
    doc.text("Bonafide Certificate", 80, 20);
    doc.setFontSize(12);
    doc.text("This is to certify that " + name + " is a bonafide student of", 20, 40);
    doc.text(institution + ". This certificate is issued for " + purpose + ".", 20, 50);
    doc.text("Date: " + date, 20, 70);
    doc.text("Place: TKR COLLEGE ", 20, 90);
    
    doc.save("Bonafide_Certificate.pdf");
=======
=======
>>>>>>> Stashed changes
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'https://tkrcet.ac.in/wp-content/themes/tkrcet/assets/images/logo-tkrcet.png';
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');

        // Add logo and title
        doc.addImage(imgData, 'PNG', 30, 10, 150, 30);
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text("BONAFIDE AND CONDUCT CERTIFICATE", 105, 50, { align: "center" });

        // Start writing line-by-line
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        let y = 70; // initial Y position

        doc.text(`This is to certify that Mr/Ms. ${studentName}, Bearing to Roll No: ${rollNo},`, 20, y); y += 10;
        doc.text(`S/O or D/O of Shri ${fatherName} is/was a student of this institution and studying in ${courseName},`, 20, y); y += 10;
        doc.text(`Branch: ${department} during the year ${academicYear}.`, 20, y); y += 10;
        doc.text(`His/Her Date of birth is: ${dob}, Purpose: ${purpose}.`, 20, y); y += 10;
        doc.text(`His/Her Conduct and Character is/was: ${conduct}.`, 20, y); y += 15;
        doc.text(`Date: ${issueDate}`, 20, y); y += 10;
        doc.text(`Place: TKR College of Engineering & Technology`, 20, y); y += 7;

        // Footer line
        doc.setFontSize(10);
        doc.text("TKR College of Engineering & Technology, Survey No.8/A, Medbowli, Meerpet, Saroornagar, Hyderabad – 500097, www.tkrcet.ac.in", 105, 280, { align: "center" });

        doc.save("Bonafide_Certificate.pdf");
    };
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
