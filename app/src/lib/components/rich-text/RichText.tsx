import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import { NodeBase } from '..';
import './RichText.css';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { useState } from 'react';





// Replace with your server's hostname and port
const baseURL = 'http://localhost:1234'; // Replace with your server's address

// Handler to make a POST request to the /nodes/:node_id endpoint
async function postNode(nodeId: string, doc: JSONContent) {
    try {
        const response = await fetch(`${baseURL}/nodes/${nodeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doc),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Handle the response data here
        console.log('POST /nodes/:node_id response:', data);

        return data
    } catch (error) {
        // Handle errors here
        console.error('Error making POST request:', error);
    }
}

// Example usage











interface RichTextProps {
    block: JSONContent
}


const RichText = ({ block, id }: RichTextProps & NodeBase) => {


    const [draft, setDraft] = useState<JSONContent>(block);


    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
        ],
        content: block,
        onUpdate: ({ editor }) => {
            setDraft(editor.getJSON())
        }
    })



    const handleUpdateNode = async (nodeId: string, data: JSONContent) => {
        await postNode(nodeId, data)
    }



    return (
        <div>
            <EditorContent editor={editor} />
            <button onPointerDown={() => handleUpdateNode(id, draft)}>Submit</button>
        </div>

    )
}

export { RichText };

export type { RichTextProps };



