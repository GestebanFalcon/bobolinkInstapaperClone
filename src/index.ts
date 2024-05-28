import puppeteer from "puppeteer";
import checkNodes from "./checkNodes";

const main = async () => {
    const browser = await puppeteer.launch({
        // headless: false,
        defaultViewport: null,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();
    await page.goto("https://web.ics.purdue.edu/~gchopra/class/public/pages/webdesign/05_simple.html");
    // const textHandles = await page.$$("p");
    // for(const textHandle of textHandles) {
    //     console.log(await page.evaluate(e => e.innerText, textHandle));
    // }
    const aHandle = await page.evaluateHandle(() => document.body);

    const bodyChildNodes = await page.evaluateHandle(body => body.childNodes, aHandle);

    const bodyChildString = await page.evaluateHandle(bodyChildren => {
        const newArray = [];
        for (let i = 0; i < bodyChildren.length; i++) {
            if (bodyChildren[i].nodeValue) {
                newArray.push(bodyChildren[i].nodeValue);
            } else {
                newArray.push('' + 'hasChildren');
            }
        }
        return newArray;
    }, bodyChildNodes);



    const bodyChildEval = await page.evaluateHandle(async (e) => {

        async function checkNodes(childNodes: NodeListOf<ChildNode>): Promise<any> {

            const newArray = [];
            for (let i = 0; i < childNodes.length; i++) {
                if (childNodes[i].nodeValue) {
                    newArray.push(childNodes[i].nodeValue);
                }
                if (childNodes[i].hasChildNodes()) {
                    newArray.push(await checkNodes(childNodes[i].childNodes));
                }
            }
            return newArray;
                
        }

        return (await checkNodes(e));
    }, bodyChildNodes);

    console.log(await bodyChildEval.jsonValue());



    // await checkNodes(bodyChildNodes, page);

}

main();
