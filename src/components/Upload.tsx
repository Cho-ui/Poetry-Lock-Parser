import React, { ChangeEvent, useState, useEffect } from "react";
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

    useEffect(() => {
        console.log(props.packages)
    }, [props.packages]);
    

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setSelectedFile(files[0]);
    }

    const parseFile = async () => {
        try {
            //console.log(selectedFile?.name)
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
            props.setTabValue("view")
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
                    <Link to={{pathname: "/view" }}>
                    <Button variant="contained" onClick={() => parseFile()}>
                        Parse
                    </Button>
                    </Link>
                </Stack>
            </label>
        </div>
    )
}