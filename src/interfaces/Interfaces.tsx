export interface IPackage {
    packageArray: {
            name: string,
            description: string,
            optional: boolean,
            foundAsPackage: boolean,
            packageDependencies?: any[],
            reverseDependencies?: any[]
    }[],
    package: {
        name: string,
        description: string,
        optional: boolean,
        foundAsPackage: boolean,
        packageDependencies?: any[],
        reverseDependencies?: any[]
    }
};