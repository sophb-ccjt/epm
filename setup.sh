set -o pipefail

LOCAL_TESTING=false

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
        echo "\"$PACKAGE\" is installed and available in PATH."
    else
        echo "\"$PACKAGE\" is either not installed or not in PATH!"
        if [ "$isSudo" = true ]; then
            echo "Installing $PACKAGE..."
            sudo "$pkgManager" install "$PACKAGE"
        else
            echo "Please install the package \"$PACKAGE\" manually."
            exit 1
        fi
    fi
done

echo ""
echo "Forming EPM directory..."
mkdir -p EPM
cd EPM
TEMP_FILELIST=files

if [ "$LOCAL_TESTING" = true ]; then
    cp files.txt "$TEMP_FILELIST"
else
    wget -O "$TEMP_FILELIST" -q https://raw.githubusercontent.com/sophb-ccjt/epm/refs/heads/main/EPM/files.txt
fi

echo ""
# download files listed in files.txt

while IFS= read -r file; do
    echo "Downloading \"$file\"..."
    wget -O "$file" -q -N -t 5 --timeout=12 "https://raw.githubusercontent.com/sophb-ccjt/epm/refs/heads/main/EPM/$file" || echo "Failed to download $file after 5 tries"
done < "$TEMP_FILELIST"

echo ""
echo "Finalizing..."
rm "$TEMP_FILELIST"
cd ..
chmod +x ./epm.sh

echo ""
echo "EPM Setup complete. Run \"./epm.sh\" to use the CLI."