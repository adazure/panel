

/** Get Sections */

function getSections(sections) {
    if (!sections) return;
    for (var i = 0; i < sections.length; i++) {
        const s = sections[i];
    }
}


/** End */




fetch('index.xml')
    .then(function (response) {
        return response
            .text()
            .then((str) => {
                let responseDoc = new DOMParser().parseFromString(str, 'application/xml');
                let item = responseDoc.getElementsByTagName('page');
                return item[0];
            });
    })
    .then(function (xml) {
        const value = getSections(xml.children);
    })
    .catch(function (err) {
        console.log("Something went wrong!", err);
    });