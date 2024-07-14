import puppeteer from "puppeteer";
import checkNodes from "./checkNodes";

const main = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();
    await page.goto("https://www.allrecipes.com/lemon-chicken-and-rice-casserole-recipe-8635802");
    // const textHandles = await page.$$("p");
    // for(const textHandle of textHandles) {
    //     console.log(await page.evaluate(e => e.innerText, textHandle));
    // }
    const bodyHandle = await page.evaluateHandle(() => document.body);

    const bodyChildNodes = await page.evaluateHandle(body => body.childNodes, bodyHandle);

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


    interface fakeNode {
        text?: string,
        children?: fakeNode[],
        name: string
    }

    const bodyChildEval = await page.evaluateHandle(async (e) => {

        async function checkNodes(childNodes: NodeListOf<ChildNode>, name: string): Promise<any> {

            const newFakeNode: {children: any[], name: string, text?: string} = {
                children: [],
                name: name,
            };

            for (let i = 0; i < childNodes.length; i++) {

                if (childNodes[i].nodeType === 1) {
                    const element = childNodes[i] as HTMLElement;
                    if (element.id && element.id.includes("google_ads")) {
                        continue;
                    }
                }

                if (childNodes[i].nodeValue) {
                    newFakeNode.children.push(
                        {
                            name: "#text",
                            text:  childNodes[i].nodeValue
                        }   
                    );
                }

                if (childNodes[i].hasChildNodes()) {
                    newFakeNode.children.push(await checkNodes(childNodes[i].childNodes, childNodes[i].nodeName));
                }
            }
            return newFakeNode;

        }

        const topFakeNode = await checkNodes(e, "main")
        document.body = document.createElement("body")
        async function elementBuild(parent: HTMLElement, fakeNode: fakeNode){

            let currentElement: Text | HTMLElement = document.createTextNode("");
            //make ts happy

            if (fakeNode.text) {
                currentElement = document.createTextNode(fakeNode.text);
            }

            if (fakeNode.children) {
                currentElement  = document.createElement(fakeNode.name);
                for (let i = 0; i < fakeNode.children.length; i++){
                    await elementBuild(currentElement, fakeNode.children[i])
                }
            }

            parent.appendChild(currentElement)

        }
        
        await elementBuild(document.body, topFakeNode)

        return (topFakeNode);
    }, bodyChildNodes);



    console.log(await bodyChildEval.jsonValue());



    // await checkNodes(bodyChildNodes, page);

}

main();
