export const setElementTransparency = (ele: HTMLElement, transp: number) => {
    const bgColor = window.getComputedStyle(ele).backgroundColor;
    const rgb = bgColor.match(/\((\d+),\s*(\d+),\s*(\d+).*\)$/) as RegExpMatchArray;
    ele.style.backgroundColor = `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${transp})`;
}