import React, { ChangeEvent, useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Input = styled('input')({
    display: 'none',
});

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [packageStrings, setPackageStrings] = useState<string[] | undefined>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setSelectedFile(files[0]);
    }

    const parseFile = async () => {
        try {
            const fileText = await selectedFile?.text();
            let parseStrings = fileText?.split("[[package]]");
            let packageStringArray = parseStrings?.map((pstring: string) => {
                const header = "[[package]]";
                pstring = header + pstring;
                return pstring;
            });
            packageStringArray?.shift();
            console.log(packageStringArray);
            setPackageStrings(packageStringArray);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 100 }}>
            <label htmlFor="contained-button-file">
                <Input accept=".lock" id="contained-button-file"
                    multiple={false} onChange={handleFileChange} type="file" />
                <Stack direction="row" spacing={3}>
                    <Button variant="contained" component="span">
                        Upload Poetry.lock file
                    </Button>
                    <Button variant="contained" onClick={() => parseFile()}>
                        Parse
                    </Button>
                </Stack>
            </label>
        </div>
    )
}