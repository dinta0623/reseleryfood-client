import { useMediaQuery } from "@mantine/hooks";
import { Container } from "@mantine/core";

const Components = ({ children, ...props }) => {
    const isMobile = useMediaQuery("(max-width: 40em)");
    return (
        <Container size={isMobile ? "100%" : "80%"} {...props}>
            {children}
        </Container>
    );
};

export default Components;
