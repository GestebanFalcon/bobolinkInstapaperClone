import { Page } from "puppeteer";

export default async function checkNodes(childNodes: NodeListOf<ChildNode>): Promise<any> {

    const newArray = [];
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeValue) {
            newArray.push([childNodes[i].nodeValue]);
        } else {
            newArray.push(await checkNodes(childNodes[i].childNodes));
        }
    }
    return newArray;
        
}