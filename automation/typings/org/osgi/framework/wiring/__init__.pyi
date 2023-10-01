import java.lang
import java.net
import java.util
import org.osgi.framework
import org.osgi.resource
import typing


class BundleCapability(org.osgi.resource.Capability):
    """
    Java class 'org.osgi.framework.wiring.BundleCapability'
    
        Interfaces:
            org.osgi.resource.Capability
    
    """
    def equals(self, object: typing.Any) -> bool: ...
    def getAttributes(self) -> java.util.Map[java.lang.String, typing.Any]: ...
    def getDirectives(self) -> java.util.Map[java.lang.String, java.lang.String]: ...
    def getNamespace(self) -> java.lang.String: ...
    @typing.overload
    def getResource(self) -> 'BundleRevision': ...
    @typing.overload
    def getResource(self) -> org.osgi.resource.Resource: ...
    def getRevision(self) -> 'BundleRevision': ...
    def hashCode(self) -> int: ...

class BundleRequirement(org.osgi.resource.Requirement):
    """
    Java class 'org.osgi.framework.wiring.BundleRequirement'
    
        Interfaces:
            org.osgi.resource.Requirement
    
    """
    def equals(self, object: typing.Any) -> bool: ...
    def getAttributes(self) -> java.util.Map[java.lang.String, typing.Any]: ...
    def getDirectives(self) -> java.util.Map[java.lang.String, java.lang.String]: ...
    def getNamespace(self) -> java.lang.String: ...
    @typing.overload
    def getResource(self) -> 'BundleRevision': ...
    @typing.overload
    def getResource(self) -> org.osgi.resource.Resource: ...
    def getRevision(self) -> 'BundleRevision': ...
    def hashCode(self) -> int: ...
    def matches(self, bundleCapability: BundleCapability) -> bool: ...

class BundleRevision(org.osgi.framework.BundleReference, org.osgi.resource.Resource):
    """
    Java class 'org.osgi.framework.wiring.BundleRevision'
    
        Interfaces:
            org.osgi.framework.BundleReference, org.osgi.resource.Resource
    
      Attributes:
        PACKAGE_NAMESPACE (java.lang.String): final static field
        BUNDLE_NAMESPACE (java.lang.String): final static field
        HOST_NAMESPACE (java.lang.String): final static field
        TYPE_FRAGMENT (int): final static field
    
    """
    PACKAGE_NAMESPACE: typing.ClassVar[java.lang.String] = ...
    BUNDLE_NAMESPACE: typing.ClassVar[java.lang.String] = ...
    HOST_NAMESPACE: typing.ClassVar[java.lang.String] = ...
    TYPE_FRAGMENT: typing.ClassVar[int] = ...
    def equals(self, object: typing.Any) -> bool: ...
    def getCapabilities(self, string: java.lang.String) -> java.util.List[org.osgi.resource.Capability]: ...
    def getDeclaredCapabilities(self, string: java.lang.String) -> java.util.List[BundleCapability]: ...
    def getDeclaredRequirements(self, string: java.lang.String) -> java.util.List[BundleRequirement]: ...
    def getRequirements(self, string: java.lang.String) -> java.util.List[org.osgi.resource.Requirement]: ...
    def getSymbolicName(self) -> java.lang.String: ...
    def getTypes(self) -> int: ...
    def getVersion(self) -> org.osgi.framework.Version: ...
    def getWiring(self) -> 'BundleWiring': ...
    def hashCode(self) -> int: ...

class BundleRevisions(org.osgi.framework.BundleReference):
    """
    Java class 'org.osgi.framework.wiring.BundleRevisions'
    
        Interfaces:
            org.osgi.framework.BundleReference
    
    """
    def getRevisions(self) -> java.util.List[BundleRevision]: ...

class BundleWire(org.osgi.resource.Wire):
    """
    Java class 'org.osgi.framework.wiring.BundleWire'
    
        Interfaces:
            org.osgi.resource.Wire
    
    """
    def equals(self, object: typing.Any) -> bool: ...
    @typing.overload
    def getCapability(self) -> BundleCapability: ...
    @typing.overload
    def getCapability(self) -> org.osgi.resource.Capability: ...
    @typing.overload
    def getProvider(self) -> BundleRevision: ...
    @typing.overload
    def getProvider(self) -> org.osgi.resource.Resource: ...
    def getProviderWiring(self) -> 'BundleWiring': ...
    @typing.overload
    def getRequirement(self) -> BundleRequirement: ...
    @typing.overload
    def getRequirement(self) -> org.osgi.resource.Requirement: ...
    @typing.overload
    def getRequirer(self) -> BundleRevision: ...
    @typing.overload
    def getRequirer(self) -> org.osgi.resource.Resource: ...
    def getRequirerWiring(self) -> 'BundleWiring': ...
    def hashCode(self) -> int: ...

class BundleWiring(org.osgi.framework.BundleReference, org.osgi.resource.Wiring):
    """
    Java class 'org.osgi.framework.wiring.BundleWiring'
    
        Interfaces:
            org.osgi.framework.BundleReference, org.osgi.resource.Wiring
    
      Attributes:
        FINDENTRIES_RECURSE (int): final static field
        LISTRESOURCES_RECURSE (int): final static field
        LISTRESOURCES_LOCAL (int): final static field
    
    """
    FINDENTRIES_RECURSE: typing.ClassVar[int] = ...
    LISTRESOURCES_RECURSE: typing.ClassVar[int] = ...
    LISTRESOURCES_LOCAL: typing.ClassVar[int] = ...
    def findEntries(self, string: java.lang.String, string2: java.lang.String, int: int) -> java.util.List[java.net.URL]: ...
    def getCapabilities(self, string: java.lang.String) -> java.util.List[BundleCapability]: ...
    def getClassLoader(self) -> java.lang.ClassLoader: ...
    def getProvidedResourceWires(self, string: java.lang.String) -> java.util.List[org.osgi.resource.Wire]: ...
    def getProvidedWires(self, string: java.lang.String) -> java.util.List[BundleWire]: ...
    def getRequiredResourceWires(self, string: java.lang.String) -> java.util.List[org.osgi.resource.Wire]: ...
    def getRequiredWires(self, string: java.lang.String) -> java.util.List[BundleWire]: ...
    def getRequirements(self, string: java.lang.String) -> java.util.List[BundleRequirement]: ...
    @typing.overload
    def getResource(self) -> BundleRevision: ...
    @typing.overload
    def getResource(self) -> org.osgi.resource.Resource: ...
    def getResourceCapabilities(self, string: java.lang.String) -> java.util.List[org.osgi.resource.Capability]: ...
    def getResourceRequirements(self, string: java.lang.String) -> java.util.List[org.osgi.resource.Requirement]: ...
    def getRevision(self) -> BundleRevision: ...
    def isCurrent(self) -> bool: ...
    def isInUse(self) -> bool: ...
    def listResources(self, string: java.lang.String, string2: java.lang.String, int: int) -> java.util.Collection[java.lang.String]: ...

class FrameworkWiring(org.osgi.framework.BundleReference):
    """
    Java class 'org.osgi.framework.wiring.FrameworkWiring'
    
        Interfaces:
            org.osgi.framework.BundleReference
    
    """
    def findProviders(self, requirement: org.osgi.resource.Requirement) -> java.util.Collection[BundleCapability]: ...
    def getDependencyClosure(self, collection: typing.Union[java.util.Collection[org.osgi.framework.Bundle], typing.Sequence[org.osgi.framework.Bundle]]) -> java.util.Collection[org.osgi.framework.Bundle]: ...
    def getRemovalPendingBundles(self) -> java.util.Collection[org.osgi.framework.Bundle]: ...
    def refreshBundles(self, collection: typing.Union[java.util.Collection[org.osgi.framework.Bundle], typing.Sequence[org.osgi.framework.Bundle]], frameworkListenerArray: typing.List[org.osgi.framework.FrameworkListener]) -> None: ...
    def resolveBundles(self, collection: typing.Union[java.util.Collection[org.osgi.framework.Bundle], typing.Sequence[org.osgi.framework.Bundle]]) -> bool: ...
