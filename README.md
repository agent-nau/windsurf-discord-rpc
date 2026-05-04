# Windsurf Status Extension

A Windsurf extension that displays your current coding activity and provides Discord Rich Presence integration.

## Features

- **Status Bar Display**: Shows current file, workspace, and language information
- **Discord Rich Presence**: Share your coding activity on Discord
- **Language Detection**: Automatically detects programming languages
- **File Tracking**: Shows current file being edited
- **Workspace Context**: Displays current workspace name

## Installation

1. Install the extension from the VS Code Marketplace
2. Reload VS Code
3. The extension will automatically start

## Usage

### Basic Usage

The extension automatically shows your coding activity in the status bar and updates Discord Rich Presence when enabled.

### Commands

- `Windsurf Status: Enable` - Enable Discord Rich Presence
- `Windsurf Status: Disable` - Disable Discord Rich Presence  
- `Windsurf Status: Restart` - Restart Discord connection
- `Windsurf Status: Show Current Status` - Display current activity information

### Configuration

Access extension settings through:

1. **Settings UI**: Go to `File > Preferences > Settings > Extensions > Windsurf Status`
2. **Command Palette**: Press `Ctrl+Shift+P` and search for "Windsurf Status"

#### Available Settings

- **Enabled**: Toggle Discord Rich Presence on/off
- **Client ID**: Your Discord Application Client ID (optional)
- **Show File Name**: Display current file in Discord status
- **Show Workspace**: Display workspace name in Discord status
- **Show Language**: Show programming language icon and name
- **Show Line Count**: Include line count in Discord status
- **Idle Timeout**: Seconds of inactivity before showing idle status
- **Reset on Idle**: Reset Discord status when idle
- **Details Template**: Customize the top line of Discord status
- **State Template**: Customize the bottom line of Discord status

#### Template Variables

Use these variables in your custom templates:

- `{{file}}` - Current file name
- `{{workspace}}` - Current workspace name
- `{{lang}}` - Programming language name
- `{{lines}}` - Line count of current file

## Troubleshooting

### Extension Not Working

1. Make sure Discord is running
2. Check if Discord Rich Presence is enabled in Discord settings
3. Try restarting the Discord connection using the command

### Discord Status Not Updating

1. Check your internet connection
2. Verify the Client ID is correct
3. Try restarting the extension

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues, please:

1. Check the troubleshooting section above
2. Create an issue on the GitHub repository
3. Include details about your VS Code version and operating system
