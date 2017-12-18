export function parseTextNodes(stringValue){
    var textNodes = []; 
    while (stringValue.length > 0){
        var leftIndex = stringValue.indexOf("<a")
        var rightIndex = stringValue.indexOf("</a>")
        if(leftIndex < 0){
            var displayText = stringValue
            textNodes.push({
                type: "text",
                text: displayText,
                originalText: stringValue
            })
            break;  
        }
        if(leftIndex > 0){
            var displayText = stringValue.substring(0, leftIndex)
            textNodes.push({
                type: "text",
                text: displayText,
                originalText: displayText
            })         
        }
        if(leftIndex >=0 && rightIndex > 0){
            var linkText = stringValue.substring(leftIndex, rightIndex+4)
            var displayTextStart = linkText.indexOf(">");
            var displayTextEnd = linkText.indexOf("</a>");
            var hrefSearchText = "href=\"";
            var hrefTextStart = linkText.indexOf(hrefSearchText);
            var displayText = "@" + linkText.substring(displayTextStart+1, displayTextEnd);
            var linkUrl = linkText.substring(hrefTextStart+hrefSearchText.length); //Remove two "s
            linkUrl = linkUrl.split("\"")[0]
            textNodes.push({
                type: "link",
                text: displayText,
                link: linkUrl,
                originalText: linkText
            })  
        }       
        stringValue = stringValue.substring(rightIndex+4)
    }
    return textNodes;     
}