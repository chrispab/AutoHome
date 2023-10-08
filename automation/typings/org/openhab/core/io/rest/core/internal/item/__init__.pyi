import java.lang
import java.util
import javax.ws.rs.core
import org.openhab.core.events
import org.openhab.core.io.rest
import org.openhab.core.items
import org.openhab.core.items.dto
import typing


class ItemResource(org.openhab.core.io.rest.RESTResource):
    """
    Java class 'org.openhab.core.io.rest.core.internal.item.ItemResource'
    
        Extends:
            java.lang.Object
    
        Interfaces:
            org.openhab.core.io.rest.RESTResource
    
      Constructors:
        * ItemResource(org.openhab.core.io.rest.DTOMapper, org.openhab.core.events.EventPublisher, org.openhab.core.items.ItemBuilderFactory, org.openhab.core.items.ItemRegistry, org.openhab.core.io.rest.LocaleService, org.openhab.core.items.ManagedItemProvider, org.openhab.core.items.MetadataRegistry, org.openhab.core.io.rest.core.internal.item.MetadataSelectorMatcher)
    
      Attributes:
        PATH_ITEMS (java.lang.String): final static field
    
    """
    PATH_ITEMS: typing.ClassVar[java.lang.String] = ...
    def __init__(self, dtoMapper: org.openhab.core.io.rest.DTOMapper, eventPublisher: org.openhab.core.events.EventPublisher, itemBuilderFactory: org.openhab.core.items.ItemBuilderFactory, itemRegistry: org.openhab.core.items.ItemRegistry, localeService: org.openhab.core.io.rest.LocaleService, managedItemProvider: org.openhab.core.items.ManagedItemProvider, metadataRegistry: org.openhab.core.items.MetadataRegistry, metadataSelectorMatcher: 'MetadataSelectorMatcher'): ...
    def addMember(self, itemName: java.lang.String, memberItemName: java.lang.String) -> javax.ws.rs.core.Response: ...
    def addMetadata(self, itemname: java.lang.String, namespace: java.lang.String, metadata: org.openhab.core.items.dto.MetadataDTO) -> javax.ws.rs.core.Response: ...
    def addTag(self, itemname: java.lang.String, tag: java.lang.String) -> javax.ws.rs.core.Response: ...
    def createOrUpdateItem(self, uriInfo: javax.ws.rs.core.UriInfo, httpHeaders: javax.ws.rs.core.HttpHeaders, language: java.lang.String, itemname: java.lang.String, item: org.openhab.core.items.dto.GroupItemDTO) -> javax.ws.rs.core.Response: ...
    def createOrUpdateItems(self, items: typing.List[org.openhab.core.items.dto.GroupItemDTO]) -> javax.ws.rs.core.Response: ...
    def getItemData(self, uriInfo: javax.ws.rs.core.UriInfo, httpHeaders: javax.ws.rs.core.HttpHeaders, language: java.lang.String, namespaceSelector: java.lang.String, itemname: java.lang.String) -> javax.ws.rs.core.Response: ...
    def getItems(self, uriInfo: javax.ws.rs.core.UriInfo, httpHeaders: javax.ws.rs.core.HttpHeaders, language: java.lang.String, type: java.lang.String, tags: java.lang.String, namespaceSelector: java.lang.String, recursive: bool, fields: java.lang.String) -> javax.ws.rs.core.Response: ...
    def getPlainItemState(self, itemname: java.lang.String) -> javax.ws.rs.core.Response: ...
    def postItemCommand(self, itemname: java.lang.String, value: java.lang.String) -> javax.ws.rs.core.Response: ...
    def putItemState(self, language: java.lang.String, itemname: java.lang.String, value: java.lang.String) -> javax.ws.rs.core.Response: ...
    def removeItem(self, itemname: java.lang.String) -> javax.ws.rs.core.Response: ...
    def removeMember(self, itemName: java.lang.String, memberItemName: java.lang.String) -> javax.ws.rs.core.Response: ...
    def removeMetadata(self, itemname: java.lang.String, namespace: java.lang.String) -> javax.ws.rs.core.Response: ...
    def removeTag(self, itemname: java.lang.String, tag: java.lang.String) -> javax.ws.rs.core.Response: ...

class MetadataSelectorMatcher(java.lang.Object):
    """
    Java class 'org.openhab.core.io.rest.core.internal.item.MetadataSelectorMatcher'
    
        Extends:
            java.lang.Object
    
      Constructors:
        * MetadataSelectorMatcher(org.openhab.core.items.MetadataRegistry)
    
    """
    def __init__(self, metadataRegistry: org.openhab.core.items.MetadataRegistry): ...
    def filterNamespaces(self, namespaceSelector: java.lang.String, locale: java.util.Locale) -> java.util.Set[java.lang.String]: ...