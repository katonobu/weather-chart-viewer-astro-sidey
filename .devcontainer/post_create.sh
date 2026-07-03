sudo apt-get update
sudo apt-get install -y nodejs npm

mkdir org
cd org
git clone --depth 1 --branch main https://github.com/odhyp/astro-sidey.git
cd ..

npm install

echo "versions"
node --version
npm --version

echo "post create finished"
