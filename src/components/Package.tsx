import React from 'react';
import { Link } from 'react-router-dom';
import { IPackage } from '../interfaces/Interfaces';

type Props = {
    packageName: string,
    packages: IPackage["packageArray"] | undefined
    setPackageName: React.Dispatch<React.SetStateAction<string>>
}

export default function Package(props: Props) {


    const savePackageName = (name: string) => {
        props.setPackageName(name);
    }

    const Package = () => {
        let packageToDisplay: IPackage["package"] =
        {
            name: "",
            description: "",
            optional: true,
            foundAsPackage: true,
            packageDependencies: [],
            reverseDependencies: []
        };

        const found = props.packages?.filter(p => p.name === props.packageName)

        if (found?.length) {
            packageToDisplay.name = found[0].name;
            packageToDisplay.description = found[0].description;
            packageToDisplay.optional = found[0].optional;
            packageToDisplay.foundAsPackage = found[0].foundAsPackage;
            packageToDisplay.packageDependencies = found[0].packageDependencies;
            packageToDisplay.reverseDependencies = found[0].reverseDependencies;
        }

        return (
            <div style={{marginBottom: 30}}>
                <h2>{packageToDisplay.name}</h2>
                <p><b>Description:</b> <br/><i>{packageToDisplay.description}</i></p>
                <b>Dependencies: </b>
                <div>
                    {packageToDisplay.packageDependencies?.map((item, index) => (
                        packageItem(item, index)
                    ))}
                </div>
                <br/>
                <b>Reverse dependencies: </b>
                <div>
                    {packageToDisplay.reverseDependencies?.map((item, index) => (
                        packageItem(item, index)
                    ))}
                </div>
            </div>
        )
    }

    const packageItem = (p: IPackage["package"], index: number) => {
        if (p.foundAsPackage) {
            return (
                <div>
                    <Link to="/package" onClick={() => savePackageName(p.name)} key={index}>
                        {p.name}
                    </Link>
                </div>
            )
        } else {
            return (
                <div key={index}>
                    {p.name}
                </div>
            )
        }
    }

    return (
        <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", marginTop: 20
        }}>
            <Package />
        </div>
    )
}