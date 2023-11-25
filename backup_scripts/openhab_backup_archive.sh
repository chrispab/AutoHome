#!/bin/bash
#setup ssh keys
#ssh-keygen -t rsa
#ssh-copy-id user@serverip

ls -t1 /var/lib/openhab/backups/* | tail -n +11 | xargs rm -f
echo "last seven local backup files are saved in /var/lib/openhab/backups/ & 192.168.0.110:/mnt/sata_unique1/currentbackups/openhabian_backups"

#copy backups to remote backup on network
echo "Copying /var/lib/openhab/backups/ pi@192.168.0.110:/mnt/sata_unique1/currentbackups/openhabian_backups"
#rsync -av --delete /home/pi/IOTstack/backups/ pi@192.168.0.110:/mnt/sata_unique1/currentbackups/iotstack_backups
# rsync -av --delete /var/lib/openhab/backups/ pi@192.168.0.110:/mnt/sata_unique1/currentbackups/openhabian_backups
# rsync -e 'ssh -p 22' -avzp /home/maurice/dev/ maurice-Laptop.local:/home/maurice/dev/
# rsync -az -e 'ssh -i /home/openhabian/.ssh/id_ed25519.pub' /var/lib/openhab/backups/  pi@192.168.0.110:/mnt/sata_unique1/currentbackups/openhabian_backups
rsync -azvp /var/lib/openhab/backups/  pi@192.168.0.110:/mnt/sata_unique1/currentbackups/openhabian_backups

# rsync -az -e 'ssh -i /home/openhabian/.ssh/id_ed25519.pub' /var/lib/openhab/backups/  openhabian@192.168.0.110:/mnt/sata_unique1/currentbackups/openhabian_backups
