// Create a new Photoshop document
var doc = app.documents.add(1080, 1080, 72, "TestImage", NewDocumentMode.RGB, DocumentFill.WHITE);

// Get today's date and format it as YYYY-MM-DD
var today = new Date();
var formattedDate = today.getFullYear() + "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) + "-" +
    ("0" + today.getDate()).slice(-2);

// Save the file as a PNG
var exportOptions = new ExportOptionsSaveForWeb();
exportOptions.format = SaveDocumentType.PNG;
exportOptions.PNG8 = false; // Set to true for PNG-8, false for PNG-24

// Specify the output file path with today's date as the filename
var outputFile = new File("~/Desktop/" + formattedDate + ".png");

// Export the document
doc.exportDocument(outputFile, ExportType.SAVEFORWEB, exportOptions);

// Alert to indicate the script is finished
alert("Document created and exported to Desktop as " + formattedDate + ".png");
