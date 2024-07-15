// Layout.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Flex, Heading, VStack, HStack, Spacer, Text, IconButton,
    Drawer,
    DrawerBody,
    Input, Button,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Divider,
    Switch,
    useColorMode, useColorModeValue,
    Avatar,
    Icon,
    Link
} from '@chakra-ui/react';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdGroup } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { VscInbox } from "react-icons/vsc";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoPin } from "react-icons/go";
import { IoSend } from 'react-icons/io5';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FiUsers, FiMessageSquare, FiUser, FiPhone, FiBookmark, FiSettings, FiMoon } from 'react-icons/fi';

export default function Layout() {
    const { colorMode } = useColorMode();
    const hoverColor = useColorModeValue('none', 'white');
    const [totalChats, setTotalChats] = useState(0)
    const [items, setItems] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const [selectedChat, setSelectedChat] = useState(null);
    const [page, setPage] = useState(1);
    const LIMIT = 3;
    const [activePage, setActivePage] = useState(1);
    const [currentMessages, setCurrentMessages] = useState([])

    const [currentChat, setcurrentChat] = useState(null)
    const handleChatClick = (index) => {
        setSelectedChat(index);
        setcurrentChat(items[index])
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get(`https://devapi.beyondchats.com/api/get_all_chats?page=${page}`);
                setTotalChats(data.data.total);
                setItems(data?.data?.data || []);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchPosts();
    }, []);

    const fetchMoreData = useCallback(() => {

        try {
            axios.get(`https://devapi.beyondchats.com/api/get_all_chats?page=${page + 1}`)
                .then(({ data }) => {
                    setItems(prevItems => [...prevItems, ...(data?.data?.data || [])]);
                    setPage(prevPage => prevPage + 1);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    }, [items.length]);



    useEffect(() => {
        if (currentChat) {
            const fetchSingleChat = () => {
                axios.get(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${currentChat.id}`)
                    .then(({ data }) => {
                        setCurrentMessages(data.data)
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

            fetchSingleChat()
        }
    }, [currentChat])

    const MenuItem = ({ icon, text, rightElement }) => (
        <HStack w="full" py={2} px={4} spacing={3}>
            <Icon as={icon} boxSize={5} />
            <Text flex={1}>{text}</Text>
            {rightElement}
        </HStack>
    );
    const { toggleColorMode } = useColorMode();
    const color = useColorModeValue('black', 'white');

    const SideMenu = () => (
        <Box w="100%" bg={bg} h="100vh">
            <VStack align="stretch" spacing={0}>
                <HStack p={4} spacing={3}>
                    <Avatar size="sm" name="CM" bg="blue.500" color="white" />
                    <Box flex={1}>
                        <Text fontWeight="bold">Chal mc</Text>
                        <Text fontSize="xs" color="gray.500">Set Emoji Status</Text>
                    </Box>
                    <Icon as={ChevronDownIcon} />
                </HStack>
                <Divider />
                <MenuItem icon={FiUsers} text="New Group" />
                <MenuItem icon={FiMessageSquare} text="New Channel" />
                <MenuItem icon={FiUser} text="Contacts" />
                <MenuItem icon={FiPhone} text="Calls" />
                <MenuItem icon={FiBookmark} text="Saved Messages" />
                <MenuItem icon={FiSettings} text="Settings" />
                <MenuItem
                    icon={FiMoon}
                    text="Night Mode"
                    rightElement={<Switch
                        size="sm"
                        isChecked={colorMode === 'dark'}
                        onChange={toggleColorMode}
                    />}
                />
            </VStack>
        </Box>
    );

    const bg = useColorModeValue('white', 'gray.800');
    
    const chatbg = useColorModeValue('white', 'gray.600');
    const textColor = useColorModeValue('black', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const inputBg = useColorModeValue('gray.100', 'gray.700');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');
    const selectedBg = useColorModeValue('blue.300', 'blue.600');


    return (
        <Flex direction="column" minH="100vh" bg={bg} color={textColor}>
            <Flex as="main" flex="1" direction={{ base: 'column', md: 'row' }}>
                <VStack w={{ base: '100%', md: '25%' }} h="100vh" borderRight="1px solid" borderColor={borderColor}>
                    <HStack pt={2} pb={1} pl={4} pr={4} w="100%" h="max-content">

                        <IconButton
                            icon={<GiHamburgerMenu size={'sm'} />}
                            ref={btnRef}
                            size="xs"
                            color="gray.300"
                            bg="none"
                            _hover={colorMode === 'dark' ? { color: 'white', cursor: 'pointer' } : {}}
                            onClick={onOpen}
                        />
                        <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
                            <DrawerOverlay />
                            <DrawerContent>
                                <SideMenu />
                            </DrawerContent>
                        </Drawer>

                        <Input bg={'gray.100'} _focus={{ bg: 'white' }} placeholder="Search" size="sm" borderRadius="20px" _placeholder={{ color: placeholderColor }} />
                    </HStack>
                    <Flex direction="column" height="100vh">
                        <Box
                            w="100%"
                            flex="1"
                            overflowY="auto"
                            borderRadius="md"
                            maxHeight="90vh"
                        >
                            <InfiniteScroll
                                dataLength={items.length}
                                next={fetchMoreData}
                                hasMore={items.length < totalChats}
                                loader={<Flex w="400px" bg={'red.200'} justifyContent={'center'} alignItems={'center'}><Text>Loading...</Text></Flex>}
                                endMessage={<Flex mt={5} pb={10} w="100%" justifyContent={'center'} alignItems={'center'}><Text>No more items to load</Text></Flex>}
                                scrollThreshold="200px"
                                height="90vh"
                            >
                                {
                                    items && items.length > 0 ? (
                                        items.map((chat, index) => (
                                            <HStack
                                                _hover={{ bg: selectedChat === index ? 'blue.300' : 'gray.100', cursor: 'pointer' }}
                                                bg={selectedChat === index ? 'blue.300' : 'transparent'}
                                                color={selectedChat === index ? 'white' : 'black'}
                                                key={index}
                                                p={4}
                                                height="70px"
                                                onClick={() => handleChatClick(index)}
                                            >
                                                <Avatar name={chat.creator.name} src='https://bit.ly/broken-link' size={'md'} />
                                                <VStack spacing={0} w="100%">
                                                    <HStack w={'100%'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                                        <HStack spacing={1}>
                                                            <Icon as={MdGroup} color={color} />
                                                            <Text color={color} fontSize="14px" fontWeight={700} noOfLines={1}>
                                                                {chat.creator.name}
                                                            </Text>
                                                        </HStack>
                                                        <Text color={selectedChat === index ? 'white' : 'gray.500'}
                                                            fontSize={'12px'} noOfLines={1}>
                                                            {formatDistanceToNow(chat.updated_at, { addSuffix: true })}
                                                        </Text>
                                                    </HStack>
                                                    <Text color={selectedChat === index ? 'white' : 'gray.500'} fontSize={'12px'} noOfLines={1}>
                                                        <span style={{ fontWeight: '400', fontSize: '14px', color: selectedChat === index ? 'white' : '#0088cc' }}>username:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        ))
                                    ) : (null)
                                }
                            </InfiniteScroll>
                        </Box>
                    </Flex>
                </VStack>
                {!currentChat ? (
                    <VStack bgSize={'cover'} bgImage={'./image.png'} backgroundRepeat={'no-repeat'} backgroundPosition={'center'} spacing={1} w={{ base: '100%', md: '75%' }} h="100vh" />
                ) : (
                    <VStack
                        bgSize={'cover'}
                        bgImage={'./image.png'}
                        backgroundRepeat={'no-repeat'}
                        backgroundPosition={'center'}
                        spacing={1}
                        w={{ base: '100%', md: '75%' }}
                        h="100vh"
                        bg={bg}
                    >
                        <HStack borderBottom={'1px'} borderColor={borderColor} h={'7%'} w="100%" bg={bg}>

                            <VStack spacing={0} w="70%" alignItems={'flex-start'} p={4}>
                                <Text color={color} fontSize="14px" fontWeight={620} noOfLines={1}>
                                    Lorem ipsum dolor sit
                                </Text>
                                <Text
                                    color={'gray.500'}
                                    fontSize={'12px'} noOfLines={1}>
                                    14:45 subscribers
                                </Text>
                            </VStack>
                            <HStack spacing={4} pr={5} justifyContent={'flex-end'} alignItems={'flex-end'} w="30%">
                                <Icon as={IoIosSearch} color={'gray.500'} fontSize={'x-large'} />
                                <Icon as={VscInbox} color={'gray.500'} fontSize={'x-large'} />
                                <Icon as={BsThreeDotsVertical} color={'gray.500'} fontSize={'x-large'} />
                            </HStack>
                        </HStack>

                        <HStack pt={1} pl={4} mt={'-4px'} alignItems={'flex-start'} h={'7%'} w={'100%'} bg={bg}>
                            <VStack alignItems={'flex-start'} spacing={0} w="95%">
                                <Text fontSize={'14px'} fontWeight={600} color={'blue.400'}>
                                    Pinned message
                                </Text>
                                <Text color={color} fontSize={'14px'} noOfLines={1}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.                            </Text>
                            </VStack>
                            <Icon ml={3} mt={3} as={GoPin} />
                        </HStack>

                        <Box flex={1} w="100%" overflowY="auto" p={4} bg={bg}>
                            {

                                currentMessages && currentMessages.length > 0 ? (
                                    currentMessages.map((message, i) => (
                                        <Flex key={i} mb={4} flexDirection={'row'} alignItems={currentChat?.creator?.name === message?.sender?.name ? 'flex-end' : 'flex-start'}
                                            bgColor={currentChat?.creator?.name === message?.sender?.name ? 'flex-end' : 'flex-start'}
                                        >
                                            <VStack
                                                maxW="10%"
                                                bg={'transparent'}
                                                p={2}
                                                borderRadius="md"
                                                alignItems={'flex-end'}
                                                justifyContent={'flex-end'}
                                            >
                                                <Avatar size={'sm'} name='Abhinav Pandey' src='https://bit.ly/broken-link' />
                                            </VStack>

                                            <Box position="relative" maxW="40%" mb={4}>

                                                <>
                                                    <VStack
                                                        alignItems={'flex-start'}
                                                        bg={chatbg}
                                                        p={2}
                                                        borderRadius="lg"
                                                        spacing={2}
                                                        pb={5}
                                                    >
                                                        <HStack justify="space-between" width="100%">
                                                            <Text fontWeight="bold" color={color}>{message.sender.name}</Text>
                                                            <Text fontSize="sm" color="gray.500">Reply</Text>
                                                        </HStack>
                                                        <Text color={color}>
                                                            {message.message}
                                                        </Text>

                                                    </VStack>
                                                    <Box
                                                        position="absolute"
                                                        left="0"
                                                        bottom="-10px"
                                                        width="0"
                                                        height="0"
                                                        borderLeft="0px solid transparent"
                                                        borderRight="20px solid transparent"
                                                        borderTop="10px solid white"
                                                    />
                                                </>
                                            </Box>
                                        </Flex>
                                    ))
                                ) : (null)

                            }
                        </Box>





                        <HStack w="100%" bg={bg} pb={2} borderTop="1px" borderColor={borderColor}>
                            <Input
                                outline={'none'}
                                border={'none'}
                                placeholder="Type a message..."
                                flex={1}
                                bg={inputBg}
                                _placeholder={{ color: placeholderColor }}
                            />
                            <Button colorScheme={colorMode === 'light' ? 'blue' : 'teal'} rightIcon={<Icon as={IoSend} />}>
                                Send
                            </Button>
                        </HStack>
                    </VStack>
                )
                }

            </Flex>
        </Flex>
    );
}
