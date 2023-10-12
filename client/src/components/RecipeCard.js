import { Box, Button, Flex, Heading, Image, useToast } from "@chakra-ui/react";
import React from "react";
import { AiTwotoneHeart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RecipeCard = ({ el }) => {
  // console.log("this el", el);
  const toast = useToast();
  const token = localStorage.getItem("token");
const navigate = useNavigate()
  const handleFavouriteRecipe = () => {
    axios
      .post(
        "https://webledgerrecipeapi.onrender.com/favourite",
        JSON.stringify(el),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Check if the request was successful
        if (response.status === 201) {
          toast({
            position: "top",
            title: "Recipe added to favourites!",
            description: "We've added your recipe to your favourites.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        if (response.status === 401) {
          toast({
            position: "top",
            title: "Please Login First!",
            description: "Unauthorized Please Login",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        if (response.status === 409) {
          toast({
            position: "top",
            title: "Already add to the favourites!",
            description: "Recipe is already in the favourites!",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error adding recipe to favourites:", error);
        toast({
          position: "top",
          title: "Please Login First!",
          description: "Unauthorized Please Login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/authentication");
      });
  };

  return (
    <Box boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px;" rounded="md" pb={2}>
      <Link to={`/${el.id}`} style={{ textDecoration: "none" }}>
        <Image
          src={el.image}
          alt="recipe picture"
          rounded="md"
          width={"100%"}
          display={"block"}
        />
      </Link>
      <Flex m={5} mb={3} justifyContent={"space-between"} alignItems={"center"}>
        <Box alignContent={"center"}>
          <Heading as="h6" size="s">
            {el.title}
          </Heading>
        </Box>
        <Box>
          <Button variant="outline" >
            <AiTwotoneHeart size={26} color="red" onClick={handleFavouriteRecipe} />
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default RecipeCard;
