import React, { ChangeEvent, useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createPackageDataStructure } from "../functions/ParsingFunctions";
import { Link } from "react-router-dom";
import { IPackage } from '../interfaces/Interfaces';


type Props = {
    tabValue: string,
    setTabValue: React.Dispatch<React.SetStateAction<string>>,
    packages: IPackage["packageArray"] | undefined,
    setPackages: React.Dispatch<React.SetStateAction<{
        name: string,
        description: string,
        optional: boolean,
        foundAsPackage: boolean,
        packageDependencies?: any[],
        reverseDependencies?: any[]
    }[] | undefined>>
}

const Input = styled('input')({
    display: 'none',
});

export default function Upload(props: Props) {
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setSelectedFile(files[0]);
    }

    const checkVersion = async (file: File | undefined) => {
        const fileText = await file?.text();
        const isCorrect = fileText?.includes("lock-version = \"1.1\"");
        return isCorrect;
    }

    const parseFile = async () => {
        try {
            props.setPackages(undefined);
            const rightVersion = await checkVersion(selectedFile);
            if (!rightVersion) {
                props.setTabValue("view");
                alert("Incompatible poetry.lock-version, please use a version 1.1-file.");
                return;
            }

            const fileText = await selectedFile?.text();
            let parsePackageInfo = fileText?.split("[metadata]") // separates package info
            let parseStrings = parsePackageInfo?.[0].split("[[package]]");
            let packageStringArray = parseStrings?.map((pstring: string) => {
                const header = "[[package]]";
                pstring = header + pstring;
                return pstring;
            });
            packageStringArray?.shift();
            let packageArray = createPackageDataStructure(packageStringArray);
            props.setPackages(packageArray);
            // change the navigation highlight
            props.setTabValue("view");

        } catch (error) {
            console.error(error);
        }
    }

    const Instructions = () => {
        return (
            <div style={{ marginBottom: 30 }}>
                <ol type="1">
                    <li>Select a file for upload
                        into the program memory with the
                        "Upload poetry.lock"-button. </li>
                    <li>Press the "Parse"-button to view the package Index
                        created from the file.
                        <br /><br />
                        <i>The poetry.lock file version must be 1.1!</i>
                    </li>
                </ol>
                <br />
                {selectedFile ? "selected file: " + selectedFile.name : "selected file: no file selected"}
            </div>
        )
    }

    return (
        <div style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center", marginTop: 100
        }}>
            <Instructions />
            <label htmlFor="contained-button-file">
                <Input accept=".lock" id="contained-button-file"
                    multiple={false} onChange={handleFileChange} type="file" />
                <Stack direction="row" spacing={3}>
                    <Button variant="contained" component="span">
                        Upload Poetry.lock file
                    </Button>
                    <Link to={{ pathname: "/view" }}>
                        <Button variant="contained" onClick={() => parseFile()}>
                            Parse
                        </Button>
                    </Link>
                </Stack>
            </label>
        </div>
    )
}