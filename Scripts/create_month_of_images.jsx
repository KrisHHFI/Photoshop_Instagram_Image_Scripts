// Get the directory of the current script
var scriptDir = File($.fileName).parent.fsName;

// Build the path to the config file relative to the script's directory
var configFile = new File(scriptDir + "/../Assets/config.jsx");

if (configFile.exists) {
    $.evalFile(configFile);
} else {
    alert("The config file does not exist at the specified path.");
}

// Function to get the total days in a month
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Define the target month (1-based, where January = 1, February = 2, etc.)
var targetMonth = 2; // Change this value to generate images for a different month (e.g., 2 for February)

// Adjust targetMonth to 0-based index for Date object
var zeroBasedMonth = targetMonth - 1;

// Get the current year
var currentYear = new Date().getFullYear();

// Get the total number of days in the target month
var totalDays = daysInMonth(targetMonth, currentYear);

// Create an array of month names
var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Generate the folder name based on the month and year
var outputFolderName = monthNames[zeroBasedMonth] + "_" + currentYear;
var outputFolderPath = File(scriptDir).parent.fsName + "/Image_Output/" + outputFolderName;

// Create the folder if it doesn't exist
var outputFolder = new Folder(outputFolderPath);
if (!outputFolder.exists) {
    outputFolder.create();
}

// Iterate through each day of the target month
for (var day = 1; day <= totalDays; day++) {
    // Explicitly calculate the date for this iteration
    var specificDate = new Date(currentYear, zeroBasedMonth, day);

    // Format the date string for the specific day
    var formattedDateString = 
        monthNames[specificDate.getMonth()] + " " + specificDate.getDate() + ", " + specificDate.getFullYear();

    // Create the dynamic text content for the specific day
    var dynamicTextContent = "✨ Cosmic Guidance for\r" + formattedDateString + " ✨";

    // Create a new Photoshop document
    var doc = app.documents.add(1080, 1080, 72, "Image_" + day, NewDocumentMode.RGB, DocumentFill.WHITE);

    // Place the background image
    var backgroundFile = new File(config.backgroundImagePath);
    if (backgroundFile.exists) {
        app.open(backgroundFile);
        var backgroundDoc = app.activeDocument;

        // Copy the background image
        backgroundDoc.selection.selectAll();
        backgroundDoc.selection.copy();
        backgroundDoc.close(SaveOptions.DONOTSAVECHANGES);

        // Paste the background into the main document
        app.activeDocument = doc;
        doc.paste();

        // Resize and position the background layer
        var pastedLayer = doc.artLayers[0];
        var layerWidth = pastedLayer.bounds[2] - pastedLayer.bounds[0];
        var layerHeight = pastedLayer.bounds[3] - pastedLayer.bounds[1];
        var scaleFactor = Math.max((doc.width / layerWidth) * 100, (doc.height / layerHeight) * 100);
        pastedLayer.resize(scaleFactor, scaleFactor);
        pastedLayer.translate(-pastedLayer.bounds[0], -pastedLayer.bounds[1]);
        pastedLayer.move(doc, ElementPlacement.PLACEATBEGINNING);
    } else {
        alert("Background image not found at the specified path.");
    }

    // Add white text to the document
    var textLayer = doc.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    var textItem = textLayer.textItem;

    // Set the text content, position, and style
    textItem.contents = dynamicTextContent;
    textItem.position = [0, 430];
    textItem.size = 100;

    // Set text color to white
    var white = new SolidColor();
    white.rgb.red = 255;
    white.rgb.green = 255;
    white.rgb.blue = 255;
    textItem.color = white;

    // Convert to paragraph text and set alignment
    textItem.kind = TextType.PARAGRAPHTEXT;
    textItem.width = doc.width;
    textItem.height = 250;
    textItem.justification = Justification.CENTER;

    // Save the file with a filename based on the specific date
    var exportOptions = new ExportOptionsSaveForWeb();
    exportOptions.format = SaveDocumentType.PNG;
    exportOptions.PNG8 = false;

    var outputFile = new File(outputFolderPath + "/" + 
        currentYear + "-" + 
        ("0" + targetMonth).slice(-2) + "-" + 
        ("0" + day).slice(-2) + ".png");

    doc.exportDocument(outputFile, ExportType.SAVEFORWEB, exportOptions);

    // Close the document without saving
    doc.close(SaveOptions.DONOTSAVECHANGES);
}

// Alert to indicate the script is finished
alert("Images for " + monthNames[zeroBasedMonth] + " have been generated and saved in " + outputFolderName + ".");
