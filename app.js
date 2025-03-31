function generatePDF() {
    const { jsPDF } = window.jspdf; // Ensure jsPDF is available globally
    const doc = new jsPDF();

    const name = document.getElementById('name').value;
    const institution = document.getElementById('institution').value;
    const purpose = document.getElementById('purpose').value;
    const date = new Date().toISOString().split('T')[0];

    doc.setFontSize(16);
    doc.text("Bonafide Certificate", 80, 20);
    doc.setFontSize(12);
    doc.text("This is to certify that " + name + " is a bonafide student of", 20, 40);
    doc.text(institution + ". This certificate is issued for " + purpose + ".", 20, 50);
    doc.text("Date: " + date, 20, 70);
    doc.text("Signature: B.Nageshwar Rao ", 20, 90);
    doc.text("Head of the Department",20,40)
    
    doc.save("Bonafide_Certificate.pdf");
}
