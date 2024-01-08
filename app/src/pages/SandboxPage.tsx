import text_nodes from '@/data/text/1.1.json';


import { Renderable, render } from "@/lib/components";
import styles from "./Sandbox.module.css";

const nodes = (text_nodes.nodes) satisfies Renderable[]



const SandboxPage = () => {

  console.log(nodes)


  return (
    <main className={styles.sandbox_page}>
      {nodes.map((node) => <div>{render(node)}</div>)}
    </main>
  );
};

export { SandboxPage };


//