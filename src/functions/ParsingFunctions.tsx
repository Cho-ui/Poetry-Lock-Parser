import { IPackage } from "../interfaces/Interfaces"

export const createPackageDataStructure = (packageStringArray: string[] | undefined) => {
    if (packageStringArray) {
        let packageArray = parseObjects(packageStringArray);
        packageArray = parseReverseDependencies(packageArray);
        // make sure datastructure is sorted according to name
        packageArray?.sort((a, b) => a.name.localeCompare(b.name));
        return packageArray;
    }
}

const parseObjects = (packageStringArray: string[] | undefined) => {

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
        packageArray = parseObjectDependencies(packageStringArray, packageArray);
        packageArray = parseObjectExtras(packageStringArray, packageArray);
        return packageArray;
    }
}

const parseObjectDependencies = (packageStringArray: string[] | undefined,
    pArray: IPackage["packageArray"]) => {

        let packageArray = pArray;

        packageStringArray?.forEach(node => {
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
                    /* check whether a package with the same name is installed,
                    if so, get it's description as well */
                    packageArray.forEach(p => {
                        if (p.name === dependencyPackage.name) {
                            dependencyPackage.foundAsPackage = true;
                            dependencyPackage.description = p.description;
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
        return packageArray;
}

const parseObjectExtras = (packageStringArray: string[] | undefined,
    pArray: IPackage["packageArray"]) => {
        
        let packageArray = pArray;

        packageStringArray?.forEach(node => {
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
                             already has the extra as a dependency, 
                             create a dependency array if needed */
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

                                    // check if the extra is installed, if so, get it's description as well
                                    const isInstalled = packageArray.filter(p => p.name === dependencyPackage.name);
                                    if (isInstalled.length > 0) {
                                        dependencyPackage.foundAsPackage = true;
                                        dependencyPackage.description = isInstalled[0].description;
                                    }
                                    // add extra as an optional dependency
                                    p.packageDependencies?.push(dependencyPackage);
                                }
                            })    
                        }
                    })
                })
            }
        })
        return packageArray;
}

const parseReverseDependencies = (pArray: IPackage["packageArray"] | undefined) => {
    let packageArray = pArray;

    // go through each package in the package array
    packageArray?.forEach(pObject => {
        // create a reverse dependency array for use
        let reverseDependencies: IPackage["packageArray"] = [];

        // go through the dependency array of each package
        packageArray?.forEach(p => {
            /* find whether the pObject package 
            can be found in any package's dependency array */           
            const found = p.packageDependencies?.filter(d => d.name === pObject.name)
            
            /* If found, create an object for reverse dependency package
             and add it. Dep and revDep-arrays excluded to avoid infinite array
             structures. A similar solution is used in the other parsing functions
             when needed. */
            if (found?.length) {
                const reverseDependencyPackage: IPackage["package"] = {
                    name: p.name,
                    description: p.description,
                    optional: p.optional,
                    foundAsPackage: p.foundAsPackage
                };

                reverseDependencies.push(reverseDependencyPackage);
            }
        })
        // if dependencies were found, add a dependency array to pObject
        if (reverseDependencies.length > 0) pObject.reverseDependencies = reverseDependencies
    })
    return packageArray;
}