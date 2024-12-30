"use client";

import { useMDXComponent } from "next-contentlayer/hooks"
import Callout from "./callout";
import Image from "next/image";

const components = {
    Image,
    Callout,
};

export default function Mdx({code}:{code:string}) {
    const Component =useMDXComponent(code);


    return (
    <div className="prose lg:prose-xl max-w-full">
        <Component components={components}/>
    </div>
    );
}




