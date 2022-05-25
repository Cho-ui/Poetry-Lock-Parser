export interface IPackage {
    packageArray: {
            name: string,
            version: string,
            description: string,
            category: string,
            optional: boolean,
            pythonVersions: string,
            packageDependencies?: [],
            packageExtras?: []
    }[],
    package: {
        name: string,
        version: string,
        description: string,
        category: string,
        optional: boolean,
        pythonVersions: string,
        packageDependencies?: [],
        packageExtras?: []
    }
};