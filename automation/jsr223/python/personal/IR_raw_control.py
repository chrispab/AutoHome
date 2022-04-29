# //! IR CODES for Amp
# // tuner   0xE13EBB44
# // aux     0xE13ED926
# // video1  0xE13E43BC
# // vol up  0xE13E11EE
# // vol dn  0xE13E31CE
# // mute    0xE13E29D6
# // on      0xE13EA45B
# // off     0xE13E13E
# var String ampCodeMute = 'E13E29D6'

# rule "React on amp test switch (amptestSwitch) change/update AMP MUTE"
# when
#     Item amptestSwitch received update// your condition here
# then
#     // your logic here
#     // val String hex_code = "0xE13E29D6"
#     // val dimVal =  Integer.parseInt(0xE13E29D6, 16) as Number
#     var MyNumber = Long.parseLong(ampCodeMute, 16) as Number // mute amp
#     amplifiercode.sendCommand(MyNumber)
# end

# rule "React on selct Amp source Aux switch change/update"
# when
#     Item ampSelectSourceAux received update// your condition here
# then
#     var MyNumber = Long.parseLong('E13ED926', 16) as Number // mute amp
#     amplifiercode.sendCommand(MyNumber)
# end

# rule "React on select Amp source Tuner switch change/update"
# when
#     Item ampSelectSourceTuner received update// your condition here
# then
#     // your logic here
#     // val String hex_code = "0xE13E29D6"
#     // val dimVal =  Integer.parseInt(0xE13E29D6, 16) as Number
#     var MyNumber = Long.parseLong('E13EBB44', 16) as Number // mute amp
#     amplifiercode.sendCommand(MyNumber)
# end

# rule "React on select Amp source Video1 switch change/update"
# when
#     Item ampSelectSourceVideo1 received update// your condition here
# then
#     // your logic here
#     // val String hex_code = "0xE13E29D6"
#     // val dimVal =  Integer.parseInt(0xE13E29D6, 16) as Number
#     var MyNumber = Long.parseLong('E13E43BC', 16) as Number // mute amp
#     amplifiercode.sendCommand(MyNumber)
# end

