# ARK Android Generator v0.3

The browser builder exports an `ark-project.json` graph and generates a starter Android source set.

Build flow: Visual graph -> validation -> Android source generation -> Gradle project -> APK/AAB via GitHub Actions.

Unsupported nodes are kept in the graph and are not silently converted into fake native behavior. Native mappings will be expanded incrementally.
