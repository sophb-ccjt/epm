set -o pipefail

PACKAGES=("node")

# check for root access
if [ "$EUID" -eq 0 ]; then
    isSudo=true
else
    isSudo=false
fi

getPackageManager() {
    if command -v apt-get &> /dev/null; then
        echo "apt-get"
    elif command -v dnf &> /dev/null; then
        echo "dnf"
    elif command -v yum &> /dev/null; then
        echo "yum"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    elif command -v zypper &> /dev/null; then
        echo "zypper"
    elif command -v apk &> /dev/null; then
        echo "apk"
    else
        echo "Package manager not found" >&2
        exit 1
    fi
}

# get package manager
pkgManager=$(getPackageManager)

# info logging
echo "Has root access? $isSudo"
echo "Package manager: $pkgManager"
echo ""
echo "Setting up EPM..."
echo ""

sleep 0.5

# check if all packages exist
echo "Checking packages..."
for index in "${!PACKAGES[@]}"; do
    PACKAGE="${PACKAGES[$index]}"
    if command -v "$PACKAGE" &> /dev/null; then
        echo "$PACKAGE is installed and available in PATH"
    else
        echo "$PACKAGE is either not installed or not in PATH!"
        if [ "$isSudo" -eq true ]; then
            sudo "$pkgManager" install "$PACKAGE"
        else
            echo "Please install the package \"$PACKAGE\"."
            exit 1
        fi
    fi
done

echo ""
echo "Forming EPM directory..."
mkdir -p EPM
cd EPM
wget -O files -q https://raw.githubusercontent.com/sophb-ccjt/epm/refs/heads/main/EPM/files.txt
# cp files.txt files # when testing un-commited code
echo ""
# download files listed in files.txt
for file in $(cat files); do
    echo "Downloading \"$file\"..."
    wget "-O$file" -q -N "https://raw.githubusercontent.com/sophb-ccjt/epm/refs/heads/main/EPM/$file"
done

echo ""
echo "Finalizing..."
rm files
cd ..
chmod +x ./epm.sh

echo ""
echo "Done!"