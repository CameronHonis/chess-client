import React from "react";
import {toPxString} from "../helpers/to_px_string";
import "../styles/dots.css";


const animateDots = (dotsWrapperRef: React.RefObject<HTMLDivElement>,
                     firstDotRef: React.RefObject<HTMLDivElement>,
                     secondDotRef: React.RefObject<HTMLDivElement>,
                     thirdDotRef: React.RefObject<HTMLDivElement>,
                     time: number,
                     animationIdWrapper: { animationId: number }) => {
    function getHeight(normalizedTime: number): number {
        // returns a height with range [0, 1]
        const t = normalizedTime;
        // approx. height equations derived here: https://www.desmos.com/calculator/lqyeiurewm
        const firstBounceHeight = 1 - (4 * t - 1) * (4 * t - 1);
        const secondBounceHeight = .5 - (2.8284 * t - 2.1213) * (2.8284 * t - 2.1213);
        const thirdBounceHeight = .25 - (2 * t - 2.5) * (2 * t - 2.5);
        return Math.max(0, firstBounceHeight, secondBounceHeight, thirdBounceHeight);
    }

    const firstDotNormT = time / 1000 % 3;
    const secondDotNormT = (time / 1000 - .125) % 3;
    const thirdDotNormT = (time / 1000 - .25) % 3;
    const firstDotHeight = getHeight(firstDotNormT);
    const secondDotHeight = getHeight(secondDotNormT);
    const thirdDotHeight = getHeight(thirdDotNormT);

    const {
        left,
        top,
        width,
        height
    } = dotsWrapperRef.current!.getBoundingClientRect();
    const {
        width: dotWidth,
        height: dotHeight
    } = firstDotRef.current!.getBoundingClientRect();

    const heightRange = height - dotHeight;
    const firstDotTop = top + heightRange * (1 - firstDotHeight);
    const secondDotTop = top + heightRange * (1 - secondDotHeight);
    const thirdDotTop = top + heightRange * (1 - thirdDotHeight);
    const secondDotLeft = left + width / 2 - dotWidth / 2;
    const thirdDotLeft = left + width - dotWidth;

    firstDotRef.current!.style.top = toPxString(firstDotTop);
    secondDotRef.current!.style.top = toPxString(secondDotTop);
    thirdDotRef.current!.style.top = toPxString(thirdDotTop);
    firstDotRef.current!.style.left = toPxString(left);
    secondDotRef.current!.style.left = toPxString(secondDotLeft);
    thirdDotRef.current!.style.left = toPxString(thirdDotLeft);

    animationIdWrapper.animationId = requestAnimationFrame((t) => {
        animateDots(
            dotsWrapperRef,
            firstDotRef,
            secondDotRef,
            thirdDotRef,
            t,
            animationIdWrapper
        );
    });
}

const applyDotSizeStyle = (dotsWrapperRef: React.RefObject<HTMLDivElement>,
                           firstDotRef: React.RefObject<HTMLDivElement>,
                           secondDotRef: React.RefObject<HTMLDivElement>,
                           thirdDotRef: React.RefObject<HTMLDivElement>) => {
    const {height: wrapperHeight} = dotsWrapperRef.current!.getBoundingClientRect();
    const dotLength = wrapperHeight * .15;
    firstDotRef.current!.style.width = toPxString(dotLength);
    firstDotRef.current!.style.height = toPxString(dotLength);
    secondDotRef.current!.style.width = toPxString(dotLength);
    secondDotRef.current!.style.height = toPxString(dotLength);
    thirdDotRef.current!.style.width = toPxString(dotLength);
    thirdDotRef.current!.style.height = toPxString(dotLength);
}

export const Dots: React.FC<{ [key: string]: any }> = (props) => {
    const dotsWrapperRef = React.useRef<HTMLDivElement>(null);
    const firstDotRef = React.useRef<HTMLDivElement>(null);
    const secondDotRef = React.useRef<HTMLDivElement>(null);
    const thirdDotRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!dotsWrapperRef.current || !firstDotRef.current || !secondDotRef.current || !thirdDotRef.current) return;
        applyDotSizeStyle(dotsWrapperRef, firstDotRef, secondDotRef, thirdDotRef);
        const animationIdWrapper = {animationId: -1};
        animationIdWrapper.animationId = requestAnimationFrame(t => {
            animateDots(
                dotsWrapperRef,
                firstDotRef,
                secondDotRef,
                thirdDotRef,
                t,
                animationIdWrapper,
            );
        });

        return () => {
            cancelAnimationFrame(animationIdWrapper.animationId);
        }
    }, [firstDotRef, secondDotRef, thirdDotRef]);

    return <div className={"Dots"} {...props} ref={dotsWrapperRef}>
        <div ref={firstDotRef} className="Dot"/>
        <div ref={secondDotRef} className="Dot"/>
        <div ref={thirdDotRef} className="Dot"/>
    </div>
}