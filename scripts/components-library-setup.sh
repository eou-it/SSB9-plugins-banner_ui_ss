cd ../../../
git clone https://$1@git.ellucian.com/scm/~$1/$2.git
cd $2
sudo npm install
sudo npm install -g grunt-cli --save--dev
sudo npm install -g bower --save--dev
bower install