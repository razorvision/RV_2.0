#!/bin/bash

# Platform Detection Script
# Determines operating system and provides platform-specific guidance

detect_platform() {
    case "$(uname -s)" in
        Linux*)     PLATFORM=Linux;;
        Darwin*)    PLATFORM=Mac;;
        CYGWIN*)    PLATFORM=Windows-Cygwin;;
        MINGW*)     PLATFORM=Windows-MinGW;;
        MSYS*)      PLATFORM=Windows-MSYS;;
        *)          PLATFORM=Unknown;;
    esac

    echo "$PLATFORM"
}

provide_guidance() {
    local platform=$1

    echo "Platform detected: $platform"
    echo ""

    case $platform in
        Linux)
            echo "✅ Linux detected - Unix scripts should work natively"
            echo ""
            echo "Setup commands:"
            echo "  bash .project-intake/scripts/setup-hooks.sh"
            ;;
        Mac)
            echo "✅ macOS detected - Unix scripts should work natively"
            echo ""
            echo "Setup commands:"
            echo "  bash .project-intake/scripts/setup-hooks.sh"
            ;;
        Windows-*)
            echo "⚠️  Windows detected - Using Git Bash/MSYS"
            echo ""
            echo "You have two options:"
            echo ""
            echo "Option 1: Use PowerShell (Recommended)"
            echo "  powershell -ExecutionPolicy Bypass -File .project-intake/scripts/setup-hooks.ps1"
            echo ""
            echo "Option 2: Use Git Bash (Current)"
            echo "  bash .project-intake/scripts/setup-hooks.sh"
            echo ""
            echo "Note: Pre-commit hook will work in Git Bash but not native Windows shell"
            ;;
        *)
            echo "❌ Unknown platform"
            echo ""
            echo "Please manually check your operating system and use the appropriate setup script:"
            echo "  - Linux/Mac: bash .project-intake/scripts/setup-hooks.sh"
            echo "  - Windows:   powershell .project-intake/scripts/setup-hooks.ps1"
            ;;
    esac
}

# Main execution
PLATFORM=$(detect_platform)
provide_guidance "$PLATFORM"
