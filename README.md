# Chat Application using Chakra UI and React

This project is a responsive chat application built using React and Chakra UI. It features a layout that includes a sidebar with a list of chats and a main content area for chat details.

## Key Features:

### Responsive Layout:
- Utilizes Chakra UI's responsive design utilities to ensure the app works well on both mobile and desktop devices.

### Sidebar with Scrollable Chat List:
- A left sidebar contains a list of chats that can be scrolled without affecting the main content area.
- Each chat item includes an avatar, username, a preview of the last message, and the timestamp of the last message.

### Selectable Chat Items:
- Chat items change background color when selected, indicating the active chat.
- Click events are handled to update the selected chat item.

### Search and Drawer Components:
- A search input is provided in the sidebar for filtering chats.
- A drawer is used for additional functionalities like creating an account.

### Dark Mode Support:
- Conditional styles are applied to support both light and dark modes.

## Code Snippets:

### Main Layout
Uses `Flex`, `VStack`, and `HStack` for structuring the layout.