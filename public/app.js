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
    const institution = "TKR College of Engineering & Technology";

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

        // Add logo
        doc.addImage(imgData, 'PNG', 30, 10, 150, 30);

        // Title
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text("BONAFIDE AND CONDUCT CERTIFICATE", 105, 50, { align: "center" });

        // Certificate content
        doc.setFont("times", "normal");
        doc.setFontSize(12);
        let y = 70;
        doc.text(`This is to certify that Mr/Ms. ${studentName}, bearing Roll No: ${rollNo},`, 20, y); y += 10;
        doc.text(`S/O or D/O of Shri ${fatherName}, is/was a student of this institution,`, 20, y); y += 10;
        doc.text(`studying in ${courseName}, Branch: ${department} during the year ${academicYear}.`, 20, y); y += 10;
        doc.text(`His/Her Date of Birth is: ${dob}. Purpose: ${purpose}.`, 20, y); y += 10;
        doc.text(`His/Her Conduct and Character is/was: ${conduct}.`, 20, y); y += 15;
        doc.text(`Date: ${issueDate}`, 20, y); y += 10;
        doc.text(`Place: ${institution}`, 20, y); y += 10;

        // Footer
        doc.setFontSize(10);
        doc.text("TKR College of Engineering & Technology, Survey No.8/A, Medbowli, Meerpet,", 105, 280, { align: "center" });
        doc.text("Saroornagar, Hyderabad – 500097 | www.tkrcet.ac.in", 105, 285, { align: "center" });

        // Save PDF
        doc.save("Bonafide_Certificate.pdf");
    };
}
