export interface IPackage {
    packageArray: {
            name: string,
            description: string,
            optional: boolean,
            foundAsPackage: boolean,
            packageDependencies?: any[],
            reverseDependencies?: []
    }[],
    package: {
        name: string,
        description: string,
        optional: boolean,
        foundAsPackage: boolean,
        packageDependencies?: any[],
        reverseDependencies?: []
    }
};