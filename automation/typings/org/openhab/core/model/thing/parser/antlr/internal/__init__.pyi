import java.lang
import org.antlr.runtime
import org.eclipse.emf.ecore
import org.eclipse.xtext.parser.antlr
import org.openhab.core.model.thing.services
import typing


class InternalThingLexer(org.eclipse.xtext.parser.antlr.Lexer):
    """
    Java class 'org.openhab.core.model.thing.parser.antlr.internal.InternalThingLexer'
    
        Extends:
            org.eclipse.xtext.parser.antlr.Lexer
    
      Constructors:
        * InternalThingLexer(org.antlr.runtime.CharStream)
        * InternalThingLexer()
        * InternalThingLexer(org.antlr.runtime.CharStream, org.antlr.runtime.RecognizerSharedState)
    
      Attributes:
        T__19 (int): final static field
        T__15 (int): final static field
        T__16 (int): final static field
        T__17 (int): final static field
        T__18 (int): final static field
        T__11 (int): final static field
        T__12 (int): final static field
        T__13 (int): final static field
        T__14 (int): final static field
        T__10 (int): final static field
        RULE_ID (int): final static field
        T__26 (int): final static field
        T__27 (int): final static field
        T__28 (int): final static field
        T__29 (int): final static field
        T__22 (int): final static field
        RULE_ML_COMMENT (int): final static field
        T__23 (int): final static field
        T__24 (int): final static field
        T__25 (int): final static field
        T__20 (int): final static field
        T__21 (int): final static field
        RULE_STRING (int): final static field
        RULE_SL_COMMENT (int): final static field
        T__37 (int): final static field
        T__38 (int): final static field
        T__39 (int): final static field
        T__33 (int): final static field
        T__34 (int): final static field
        T__35 (int): final static field
        T__36 (int): final static field
        EOF (int): final static field
        T__30 (int): final static field
        T__31 (int): final static field
        T__32 (int): final static field
        RULE_WS (int): final static field
        RULE_ANY_OTHER (int): final static field
        T__44 (int): final static field
        T__40 (int): final static field
        T__41 (int): final static field
        T__42 (int): final static field
        T__43 (int): final static field
    
    """
    T__19: typing.ClassVar[int] = ...
    T__15: typing.ClassVar[int] = ...
    T__16: typing.ClassVar[int] = ...
    T__17: typing.ClassVar[int] = ...
    T__18: typing.ClassVar[int] = ...
    T__11: typing.ClassVar[int] = ...
    T__12: typing.ClassVar[int] = ...
    T__13: typing.ClassVar[int] = ...
    T__14: typing.ClassVar[int] = ...
    T__10: typing.ClassVar[int] = ...
    RULE_ID: typing.ClassVar[int] = ...
    T__26: typing.ClassVar[int] = ...
    T__27: typing.ClassVar[int] = ...
    T__28: typing.ClassVar[int] = ...
    T__29: typing.ClassVar[int] = ...
    T__22: typing.ClassVar[int] = ...
    RULE_ML_COMMENT: typing.ClassVar[int] = ...
    T__23: typing.ClassVar[int] = ...
    T__24: typing.ClassVar[int] = ...
    T__25: typing.ClassVar[int] = ...
    T__20: typing.ClassVar[int] = ...
    T__21: typing.ClassVar[int] = ...
    RULE_STRING: typing.ClassVar[int] = ...
    RULE_SL_COMMENT: typing.ClassVar[int] = ...
    T__37: typing.ClassVar[int] = ...
    T__38: typing.ClassVar[int] = ...
    T__39: typing.ClassVar[int] = ...
    T__33: typing.ClassVar[int] = ...
    T__34: typing.ClassVar[int] = ...
    T__35: typing.ClassVar[int] = ...
    T__36: typing.ClassVar[int] = ...
    EOF: typing.ClassVar[int] = ...
    T__30: typing.ClassVar[int] = ...
    T__31: typing.ClassVar[int] = ...
    T__32: typing.ClassVar[int] = ...
    RULE_WS: typing.ClassVar[int] = ...
    RULE_ANY_OTHER: typing.ClassVar[int] = ...
    T__44: typing.ClassVar[int] = ...
    T__40: typing.ClassVar[int] = ...
    T__41: typing.ClassVar[int] = ...
    T__42: typing.ClassVar[int] = ...
    T__43: typing.ClassVar[int] = ...
    @typing.overload
    def __init__(self): ...
    @typing.overload
    def __init__(self, charStream: org.antlr.runtime.CharStream): ...
    @typing.overload
    def __init__(self, charStream: org.antlr.runtime.CharStream, recognizerSharedState: org.antlr.runtime.RecognizerSharedState): ...
    def getGrammarFileName(self) -> java.lang.String: ...
    def mRULE_ANY_OTHER(self) -> None: ...
    def mRULE_ID(self) -> None: ...
    def mRULE_ML_COMMENT(self) -> None: ...
    def mRULE_SL_COMMENT(self) -> None: ...
    def mRULE_STRING(self) -> None: ...
    def mRULE_WS(self) -> None: ...
    def mT__10(self) -> None: ...
    def mT__11(self) -> None: ...
    def mT__12(self) -> None: ...
    def mT__13(self) -> None: ...
    def mT__14(self) -> None: ...
    def mT__15(self) -> None: ...
    def mT__16(self) -> None: ...
    def mT__17(self) -> None: ...
    def mT__18(self) -> None: ...
    def mT__19(self) -> None: ...
    def mT__20(self) -> None: ...
    def mT__21(self) -> None: ...
    def mT__22(self) -> None: ...
    def mT__23(self) -> None: ...
    def mT__24(self) -> None: ...
    def mT__25(self) -> None: ...
    def mT__26(self) -> None: ...
    def mT__27(self) -> None: ...
    def mT__28(self) -> None: ...
    def mT__29(self) -> None: ...
    def mT__30(self) -> None: ...
    def mT__31(self) -> None: ...
    def mT__32(self) -> None: ...
    def mT__33(self) -> None: ...
    def mT__34(self) -> None: ...
    def mT__35(self) -> None: ...
    def mT__36(self) -> None: ...
    def mT__37(self) -> None: ...
    def mT__38(self) -> None: ...
    def mT__39(self) -> None: ...
    def mT__40(self) -> None: ...
    def mT__41(self) -> None: ...
    def mT__42(self) -> None: ...
    def mT__43(self) -> None: ...
    def mT__44(self) -> None: ...
    def mTokens(self) -> None: ...

class InternalThingParser(org.eclipse.xtext.parser.antlr.AbstractInternalAntlrParser):
    """
    Java class 'org.openhab.core.model.thing.parser.antlr.internal.InternalThingParser'
    
        Extends:
            org.eclipse.xtext.parser.antlr.AbstractInternalAntlrParser
    
      Constructors:
        * InternalThingParser(org.antlr.runtime.TokenStream, org.openhab.core.model.thing.services.ThingGrammarAccess)
        * InternalThingParser(org.antlr.runtime.TokenStream)
        * InternalThingParser(org.antlr.runtime.TokenStream, org.antlr.runtime.RecognizerSharedState)
    
      Attributes:
        tokenNames ([Ljava.lang.String;): final static field
        T__19 (int): final static field
        T__15 (int): final static field
        T__16 (int): final static field
        T__17 (int): final static field
        T__18 (int): final static field
        T__11 (int): final static field
        T__12 (int): final static field
        T__13 (int): final static field
        T__14 (int): final static field
        T__10 (int): final static field
        RULE_ID (int): final static field
        T__26 (int): final static field
        T__27 (int): final static field
        T__28 (int): final static field
        T__29 (int): final static field
        T__22 (int): final static field
        RULE_ML_COMMENT (int): final static field
        T__23 (int): final static field
        T__24 (int): final static field
        T__25 (int): final static field
        T__20 (int): final static field
        T__21 (int): final static field
        RULE_STRING (int): final static field
        RULE_SL_COMMENT (int): final static field
        T__37 (int): final static field
        T__38 (int): final static field
        T__39 (int): final static field
        T__33 (int): final static field
        T__34 (int): final static field
        T__35 (int): final static field
        T__36 (int): final static field
        EOF (int): final static field
        T__30 (int): final static field
        T__31 (int): final static field
        T__32 (int): final static field
        RULE_WS (int): final static field
        RULE_ANY_OTHER (int): final static field
        T__44 (int): final static field
        T__40 (int): final static field
        T__41 (int): final static field
        T__42 (int): final static field
        T__43 (int): final static field
        FOLLOW_1 (org.antlr.runtime.BitSet): final static field
        FOLLOW_2 (org.antlr.runtime.BitSet): final static field
        FOLLOW_3 (org.antlr.runtime.BitSet): final static field
        FOLLOW_4 (org.antlr.runtime.BitSet): final static field
        FOLLOW_5 (org.antlr.runtime.BitSet): final static field
        FOLLOW_6 (org.antlr.runtime.BitSet): final static field
        FOLLOW_7 (org.antlr.runtime.BitSet): final static field
        FOLLOW_8 (org.antlr.runtime.BitSet): final static field
        FOLLOW_9 (org.antlr.runtime.BitSet): final static field
        FOLLOW_10 (org.antlr.runtime.BitSet): final static field
        FOLLOW_11 (org.antlr.runtime.BitSet): final static field
        FOLLOW_12 (org.antlr.runtime.BitSet): final static field
        FOLLOW_13 (org.antlr.runtime.BitSet): final static field
        FOLLOW_14 (org.antlr.runtime.BitSet): final static field
        FOLLOW_15 (org.antlr.runtime.BitSet): final static field
        FOLLOW_16 (org.antlr.runtime.BitSet): final static field
        FOLLOW_17 (org.antlr.runtime.BitSet): final static field
        FOLLOW_18 (org.antlr.runtime.BitSet): final static field
        FOLLOW_19 (org.antlr.runtime.BitSet): final static field
        FOLLOW_20 (org.antlr.runtime.BitSet): final static field
        FOLLOW_21 (org.antlr.runtime.BitSet): final static field
        FOLLOW_22 (org.antlr.runtime.BitSet): final static field
        FOLLOW_23 (org.antlr.runtime.BitSet): final static field
        FOLLOW_24 (org.antlr.runtime.BitSet): final static field
        FOLLOW_25 (org.antlr.runtime.BitSet): final static field
        FOLLOW_26 (org.antlr.runtime.BitSet): final static field
        FOLLOW_27 (org.antlr.runtime.BitSet): final static field
        FOLLOW_28 (org.antlr.runtime.BitSet): final static field
    
    """
    tokenNames: typing.ClassVar[typing.List[java.lang.String]] = ...
    T__19: typing.ClassVar[int] = ...
    T__15: typing.ClassVar[int] = ...
    T__16: typing.ClassVar[int] = ...
    T__17: typing.ClassVar[int] = ...
    T__18: typing.ClassVar[int] = ...
    T__11: typing.ClassVar[int] = ...
    T__12: typing.ClassVar[int] = ...
    T__13: typing.ClassVar[int] = ...
    T__14: typing.ClassVar[int] = ...
    T__10: typing.ClassVar[int] = ...
    RULE_ID: typing.ClassVar[int] = ...
    T__26: typing.ClassVar[int] = ...
    T__27: typing.ClassVar[int] = ...
    T__28: typing.ClassVar[int] = ...
    T__29: typing.ClassVar[int] = ...
    T__22: typing.ClassVar[int] = ...
    RULE_ML_COMMENT: typing.ClassVar[int] = ...
    T__23: typing.ClassVar[int] = ...
    T__24: typing.ClassVar[int] = ...
    T__25: typing.ClassVar[int] = ...
    T__20: typing.ClassVar[int] = ...
    T__21: typing.ClassVar[int] = ...
    RULE_STRING: typing.ClassVar[int] = ...
    RULE_SL_COMMENT: typing.ClassVar[int] = ...
    T__37: typing.ClassVar[int] = ...
    T__38: typing.ClassVar[int] = ...
    T__39: typing.ClassVar[int] = ...
    T__33: typing.ClassVar[int] = ...
    T__34: typing.ClassVar[int] = ...
    T__35: typing.ClassVar[int] = ...
    T__36: typing.ClassVar[int] = ...
    EOF: typing.ClassVar[int] = ...
    T__30: typing.ClassVar[int] = ...
    T__31: typing.ClassVar[int] = ...
    T__32: typing.ClassVar[int] = ...
    RULE_WS: typing.ClassVar[int] = ...
    RULE_ANY_OTHER: typing.ClassVar[int] = ...
    T__44: typing.ClassVar[int] = ...
    T__40: typing.ClassVar[int] = ...
    T__41: typing.ClassVar[int] = ...
    T__42: typing.ClassVar[int] = ...
    T__43: typing.ClassVar[int] = ...
    FOLLOW_1: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_2: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_3: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_4: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_5: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_6: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_7: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_8: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_9: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_10: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_11: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_12: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_13: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_14: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_15: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_16: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_17: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_18: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_19: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_20: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_21: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_22: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_23: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_24: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_25: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_26: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_27: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    FOLLOW_28: typing.ClassVar[org.antlr.runtime.BitSet] = ...
    @typing.overload
    def __init__(self, tokenStream: org.antlr.runtime.TokenStream): ...
    @typing.overload
    def __init__(self, tokenStream: org.antlr.runtime.TokenStream, recognizerSharedState: org.antlr.runtime.RecognizerSharedState): ...
    @typing.overload
    def __init__(self, tokenStream: org.antlr.runtime.TokenStream, thingGrammarAccess: org.openhab.core.model.thing.services.ThingGrammarAccess): ...
    def entryRuleBOOLEAN(self) -> java.lang.String: ...
    def entryRuleBaseModelItemType(self) -> java.lang.String: ...
    def entryRuleCHANNEL_ID(self) -> java.lang.String: ...
    def entryRuleModelBridge(self) -> org.eclipse.emf.ecore.EObject: ...
    def entryRuleModelChannel(self) -> org.eclipse.emf.ecore.EObject: ...
    def entryRuleModelItemType(self) -> java.lang.String: ...
    def entryRuleModelProperty(self) -> org.eclipse.emf.ecore.EObject: ...
    def entryRuleModelThing(self) -> org.eclipse.emf.ecore.EObject: ...
    def entryRuleNUMBER(self) -> java.lang.String: ...
    def entryRuleThingModel(self) -> org.eclipse.emf.ecore.EObject: ...
    def entryRuleUID(self) -> java.lang.String: ...
    def entryRuleUID_SEGMENT(self) -> java.lang.String: ...
    def entryRuleValueType(self) -> java.lang.String: ...
    def getGrammarFileName(self) -> java.lang.String: ...
    def getTokenNames(self) -> typing.List[java.lang.String]: ...
    def ruleBOOLEAN(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleBaseModelItemType(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleCHANNEL_ID(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleModelBridge(self) -> org.eclipse.emf.ecore.EObject: ...
    def ruleModelChannel(self) -> org.eclipse.emf.ecore.EObject: ...
    def ruleModelItemType(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleModelProperty(self) -> org.eclipse.emf.ecore.EObject: ...
    def ruleModelThing(self) -> org.eclipse.emf.ecore.EObject: ...
    def ruleNUMBER(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleThingModel(self) -> org.eclipse.emf.ecore.EObject: ...
    def ruleUID(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleUID_SEGMENT(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def ruleValueType(self) -> org.eclipse.xtext.parser.antlr.AntlrDatatypeRuleToken: ...
    def synpred1_InternalThing(self) -> bool: ...
    def synpred1_InternalThing_fragment(self) -> None: ...
