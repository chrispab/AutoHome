# from core.log import logging, LOG_PREFIX
# from core.actions import LogAction

# scriptExtension.importPreset("RuleSupport")
# scriptExtension.importPreset("RuleSimple")

# class myRule(SimpleRule):
#     def execute(self, module, inputs):
#         # logging.error("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZThis is a 'hello world!' from Jython rule.xxxxxxxxxxxxx")
#         LogAction.logError("class myRule(SimpleRule)", "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZThis is a 'hello world!' from Jython rule.xxxxxxxxxxxxx")

# sRule = myRule()
# sRule.setTriggers([
#     TriggerBuilder.create()
#         .withId("aTimerTrigger")
#         .withTypeUID("timer.GenericCronTrigger")
#         .withConfiguration(
#             Configuration({
#                 "cronExpression": "0 */2 * ? * *"
#             })).build()
#     ])

# automationManager.addRule(sRule)