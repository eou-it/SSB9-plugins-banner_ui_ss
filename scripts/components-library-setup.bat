echo on
cd ../../../
git clone https://%1@git.ellucian.com/scm/~%1/%2.git
cd %2
npm install