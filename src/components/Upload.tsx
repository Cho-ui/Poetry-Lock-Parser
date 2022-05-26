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
                // form an array of individual value strings to parse basic values from
                if (node.includes("[[package]]")) {
                    let nodeRows = node.split("\n");

                    // get basic values for a package object
                    let nameSub = nodeRows[1].substring(
                        nodeRows[1].indexOf("\"") + 1,
                        nodeRows[1].lastIndexOf("\""));

                    let descriptionSub = nodeRows[3].substring(
                        nodeRows[3].indexOf("\"") + 1,
                        nodeRows[3].lastIndexOf("\""));

                    let optionalSub = nodeRows[5].substring(
                        nodeRows[5].indexOf("=") + 2)
                    let optionalBool = optionalSub.toLowerCase() === 'true' ? true : false;

                    let newPackage: IPackage["package"] =
                    {
                        name: nameSub,
                        description: descriptionSub,
                        optional: optionalBool,
                        foundAsPackage: true
                    };

                    packageArray.push(newPackage);
                }
            })
            //console.log(packageArray); // logs basic objects

            /* second function from this! */

            packageStringArray.forEach(node => {

                // parse packages with dependencies
                if (node.includes("dependencies")) {
                    let nodeRows = node.split("\n");

                    // gets the package name
                    let packageWithoutDependencies = nodeRows[1].substring(
                        nodeRows[1].indexOf("\"") + 1,
                        nodeRows[1].lastIndexOf("\""));

                    // trims array to include only dependency rows
                    let trimmedFromStart = nodeRows.splice(8, (nodeRows.length - 1));
                    let dependencyRows = trimmedFromStart.splice(0, (trimmedFromStart.indexOf("")));
                    dependencyRows.shift();

                    // creates a new package array for dependencies
                    let packageDependencies: IPackage["packageArray"] = [];

                    dependencyRows.forEach(row => {
                        let dependencyPackage: IPackage["package"] = {
                            name: "",
                            description: "",
                            optional: false,
                            foundAsPackage: false
                        };

                        // parse package name from row
                        let parseName = row.substring(0, (row.indexOf("=") - 1));
                        dependencyPackage.name = parseName;

                        // check whether the dependency is flagged as optional
                        if (row.includes("optional") && row.includes("true")) {
                            dependencyPackage.optional = true;
                        }

                        // check whether a package with the same name is installed
                        packageArray.forEach(p => {
                            if (p.name === dependencyPackage.name) {
                                dependencyPackage.foundAsPackage = true;
                            }
                        })

                        // adds package to dependency array
                        packageDependencies.push(dependencyPackage);
                    })
                    // adds dependency array to package object
                    packageArray.forEach(p => {
                        if (p.name === packageWithoutDependencies) {
                            p.packageDependencies = packageDependencies;
                        }
                    })
                }
            })
            //console.log(packageArray); // logs array with dependencies

            /* third function for this! */

            packageStringArray.forEach(node => {

                // parse packages with extras
                if (node.includes("extras")) {
                    let nodeRows = node.split("\n");

                    // gets the package name
                    let packageWithoutExtras = nodeRows[1].substring(
                        nodeRows[1].indexOf("\"") + 1,
                        nodeRows[1].lastIndexOf("\""));

                    // trims array to include only extras
                    let trimmedFromStart = nodeRows.splice(
                        nodeRows.indexOf("[package.extras]"));
                    let extraRows = trimmedFromStart.splice(0, (trimmedFromStart.indexOf("")));
                    extraRows.shift();

                    // split row at "= "
                    extraRows.forEach(row => {
                        let splitLine = row.split("= ");
                        let extrasInString = splitLine[1].substring(1, splitLine[1].length - 1);

                        // split at ","
                        let singleExtras = extrasInString.split(", ");

                        let trimmedSingleExtras: string[] = [];

                        // trim and add single extra package names to array
                        singleExtras.forEach(extra => {
                            if (extra.includes(" ")) {
                                extra = extra.substring(1, extra.indexOf(" "));
                                trimmedSingleExtras.push(extra);
                            } else {
                                extra = extra.substring(1, extra.length - 1);
                                trimmedSingleExtras.push(extra);
                            }
                        });
                        
                        // identify the correct package to add extras to
                        packageArray.forEach(p => {
                            if (p.name === packageWithoutExtras) {
                                /* go through each package, check if the package
                                 already has the extra as a dependency */
                                if (p.packageDependencies === undefined) {
                                    let newArray: IPackage["packageArray"] = [];
                                    p.packageDependencies = newArray;
                                }

                                trimmedSingleExtras.forEach(extra => {
                                    const found = p.packageDependencies?.filter(d => d.name === extra);
                                    // if extra is not found as a dependency, add it
                                    if (found?.length === 0) {
                                        let dependencyPackage: IPackage["package"] = {
                                            name: extra,
                                            description: "",
                                            optional: true,
                                            foundAsPackage: false
                                        };

                                        // check if the extra is installed
                                        const isInstalled = packageArray.filter(p => p.name === dependencyPackage.name);
                                        if (isInstalled.length > 0) dependencyPackage.foundAsPackage = true;

                                        // add extra as an optional dependency
                                        p.packageDependencies?.push(dependencyPackage);
                                    }
                                })    
                            }
                        })
                    })
                }
            })
            console.log(packageArray); // logs array with full dependencies incl. extras
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