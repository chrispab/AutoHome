// items
// String        LivingRoomSpeaker_Playuri_backup    "Play uri backup"

// rule
// when
//     Item received command
// then
//     if (LivingRoomSpeaker_AppId.state == "CC1AD845" && LivingRoomSpeaker_Control.state == PLAY) {
//     LivingRoomSpeaker_Playuri_backup.postUpdate(LivingRoomSpeaker_Playuri.state)
//     playSound("doorbell.mp3")
//     Thread::sleep(3000)
//     LivingRoomSpeaker_Playuri.sendCommand(LivingRoomSpeaker_Playuri_backup.state.toString)
//     LivingRoomSpeaker_Control.sendCommand(PLAY) }
//     else {playSound("barking.mp3")}
// end
