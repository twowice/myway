import { ReactNode } from "react";

/**
* @typedef {object} TabContentsProps
* @property {string} value - TabContents에 들어갈 value
* @property {string} title - TabListTrigger, 즉 tab메뉴에 띄워질 텍스트
* @property {ReactNode} content - value의 값을 가질 때 보여질 TabContent의 자식 컴포넌트
**/

interface TabContentsProps {
    value: string,
    title: string,
    content: ReactNode
}