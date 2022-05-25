import React, { ChangeEvent, useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { IPackage } from "../interfaces/Interfaces";

const Input = styled('input')({
    display: 'none',
});

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [packages, setPackages] = useState<IPackage["packageArray"]>([]);
    //    const [packageStrings, setPackageStrings] = useState<string[] | undefined>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setSelectedFile(files[0]);
    }

    const parseFile = async () => {
        try {
            const fileText = await selectedFile?.text();
            let parsePackageInfo = fileText?.split("[metadata]") // separates package info
            let parseStrings = parsePackageInfo?.[0].split("[[package]]");
            let packageStringArray = parseStrings?.map((pstring: string) => {
                const header = "[[package]]";
                pstring = header + pstring;
                return pstring;
            });
            packageStringArray?.shift();
            createPackageObjects(packageStringArray);
            //            console.log(packageStringArray);
            //            setPackageStrings(packageStringArray);
        } catch (error) {
            console.error(error);
        }
    }

    const createPackageObjects = (packageStringArray: string[] | undefined) => {
        if (packageStringArray) {

            let packageArray: IPackage["packageArray"] = [];

            packageStringArray.forEach(node => {
                // form an array of individual value strings to parse values from
                if (node.includes("[[package]]")) {
                    let nodeRows = node.split("\n");
                    nodeRows.length = 7;
                    nodeRows.shift();

                    // get basic values for a package object
                    let nameSub = nodeRows[0].substring(
                        nodeRows[0].indexOf("\"") + 1,
                        nodeRows[0].lastIndexOf("\""));

                    let versionSub = nodeRows[1].substring(
                        nodeRows[1].indexOf("\"") + 1,
                        nodeRows[1].lastIndexOf("\""));

                    let descriptionSub = nodeRows[2].substring(
                        nodeRows[2].indexOf("\"") + 1,
                        nodeRows[2].lastIndexOf("\""));

                    let categorySub = nodeRows[3].substring(
                        nodeRows[3].indexOf("\"") + 1,
                        nodeRows[3].lastIndexOf("\""));

                    let optionalSub = nodeRows[4].substring(
                        nodeRows[4].indexOf("=") + 2)
                    let optionalBool = optionalSub.toLowerCase() === 'true' ? true : false;

                    let pythonVersionsSub = nodeRows[5].substring(
                        nodeRows[5].indexOf("\"") + 1,
                        nodeRows[5].lastIndexOf("\""));
                    
                    let newPackage: IPackage["package"] = 
                    {name: nameSub,
                    version: versionSub,
                    description: descriptionSub,
                    category: categorySub,
                    optional: optionalBool,
                    pythonVersions: pythonVersionsSub};

                    packageArray.push(newPackage); 
                }
            })
            console.log(packageArray); // basic objects logged
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