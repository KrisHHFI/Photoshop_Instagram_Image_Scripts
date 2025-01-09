// Get the directory of the current script
var scriptDir = File($.fileName).parent.fsName;

// Build the path to the config file relative to the script's directory
var configFile = new File(scriptDir + "/../Assets/config.jsx");

if (configFile.exists) {
    $.evalFile(configFile);
} else {
    alert("The config file does not exist at the specified path.");
}

// Create a new Photoshop document
var doc = app.documents.add(1080, 1080, 72, "TestImage", NewDocumentMode.RGB, DocumentFill.WHITE);

// Place the background image
var backgroundFile = new File(config.backgroundImagePath);
if (backgroundFile.exists) {
    // Open the background image
    app.open(backgroundFile);
    var backgroundDoc = app.activeDocument;

    // Copy the image to the new document
    backgroundDoc.selection.selectAll();
    backgroundDoc.selection.copy();
    backgroundDoc.close(SaveOptions.DONOTSAVECHANGES);

    // Paste the background into the main document
    app.activeDocument = doc;
    doc.paste();
    
    // Resize the pasted layer to fill the canvas
    var pastedLayer = doc.artLayers[0];
    var layerWidth = pastedLayer.bounds[2] - pastedLayer.bounds[0]; // Calculate width
    var layerHeight = pastedLayer.bounds[3] - pastedLayer.bounds[1]; // Calculate height

    var scaleFactorWidth = (doc.width / layerWidth) * 100; // Scale factor for width
    var scaleFactorHeight = (doc.height / layerHeight) * 100; // Scale factor for height

    // Scale the layer proportionally to ensure it fills the canvas
    var scaleFactor = Math.max(scaleFactorWidth, scaleFactorHeight); // Use the larger scale factor
    pastedLayer.resize(scaleFactor, scaleFactor);

    // Align the layer to the top-left corner
    pastedLayer.translate(-pastedLayer.bounds[0], -pastedLayer.bounds[1]); // Move to (0, 0)

    // Move the background layer to the bottom of the stack
    pastedLayer.move(doc, ElementPlacement.PLACEATBEGINNING);
} else {
    alert("Background image not found at the specified path.");
}

// Add white text to the document
var textLayer = doc.artLayers.add();
textLayer.kind = LayerKind.TEXT;
var textItem = textLayer.textItem;

// Set the dynamic text content with a line break after "for"
textItem.contents = config.imageText;

// Set the text position to start at the left side of the canvas (0, 430)
textItem.position = [0, 430]; // Left aligned horizontally, centered vertically
textItem.size = 100; // Font size in points

// Set text color to white
var white = new SolidColor();
white.rgb.red = 255;
white.rgb.green = 255;
white.rgb.blue = 255;
textItem.color = white; // Assign the SolidColor object

// Convert to paragraph text
textItem.kind = TextType.PARAGRAPHTEXT;

// Set text box width to full canvas width (1080px)
textItem.width = doc.width; // Set text box width to the full width of the canvas

// Set text box height
textItem.height = 250; // Set text box height

// Align the text to the center within the text box
textItem.justification = Justification.CENTER; // Align text to the center

// Save the file as a PNG
var exportOptions = new ExportOptionsSaveForWeb();
exportOptions.format = SaveDocumentType.PNG;
exportOptions.PNG8 = false; // Set to true for PNG-8, false for PNG-24

// Specify the output file path with today's date as the filename
var outputFile = new File(config.outputDirectory + today.getFullYear() + "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) + "-" +
    ("0" + today.getDate()).slice(-2) + ".png");

// Export the document
doc.exportDocument(outputFile, ExportType.SAVEFORWEB, exportOptions);

// Alert to indicate the script is finished
alert("Document created and exported to Desktop as " + formattedDate + ".png");
