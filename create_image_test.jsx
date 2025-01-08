// Create a new Photoshop document
var doc = app.documents.add(1080, 1080, 72, "TestImage", NewDocumentMode.RGB, DocumentFill.WHITE);

// Save the file as a PNG
var exportOptions = new ExportOptionsSaveForWeb();
exportOptions.format = SaveDocumentType.PNG;
exportOptions.PNG8 = false; // Set to true for PNG-8, false for PNG-24

// Specify the output file path
var outputFile = new File("~/Desktop/TestImage.png");

// Export the document
doc.exportDocument(outputFile, ExportType.SAVEFORWEB, exportOptions);

// Alert to indicate the script is finished
alert("Document created and exported to Desktop as TestImage.png");
