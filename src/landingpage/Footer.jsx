import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Container,
  GlobalStyles,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Pinterest,
} from "@mui/icons-material";
import footerBg from "../assets/Footerbg.png";

const Footer = () => {
  return (
    <>
      <GlobalStyles styles={{ body: { overflowX: "hidden" } }} />

      <Box
        sx={{
          backgroundImage: `url(${footerBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          color: "black",
          mt: 8,
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ color: "black" }}>
            <Grid container spacing={24}>
              {/* Contact Us */}
              <Grid item xs={12} sm={10} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Contact us
                </Typography>
                <Typography variant="body2">
                  <strong>Call us:</strong> Mon - Fri, 9:30 AM - 5:50 PM
                </Typography>
                <Typography variant="body2" fontWeight="bold" mt={1}>
                  Contact No: <br />
                  9876543210, 8765432109,
                  <br />
                  7654321098, 6543210987
                </Typography>
                <Typography variant="body2" mt={1}>
                  Address: <br />
                  E-Commerce Division, MAIDC, <br />
                  Krushi Udyog Bhavan, Dinkarrao Desai Marg,
                  <br />
                  Aarey Milk Colony, Goregaon (E), Mumbai - 400065
                </Typography>
                <Typography variant="body2" mt={1}>
                  Email us at: <br />
                  <Link
                    href="mailto:support@agrovihan.com"
                    underline="hover"
                    sx={{ color: "black" }}
                  >
                    support@agrovihan.com
                  </Link>
                  <br />
                  <Link
                    href="mailto:info@agrovihan.com"
                    underline="hover"
                    sx={{ color: "black" }}
                  >
                    info@agrovihan.com
                  </Link>
                </Typography>
                <Stack direction="row" spacing={1} mt={22}>
                  {[Facebook, LinkedIn, Twitter, Instagram, Pinterest].map(
                    (Icon, idx) => (
                      <IconButton key={idx} sx={{ color: "white" }}>
                        <Icon fontSize="small" />
                      </IconButton>
                    )
                  )}
                </Stack>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  QUICK LINKS
                </Typography>
                <Stack spacing={1}>
                  <Link href="/about" underline="hover" sx={{ color: "black" }}>
                    About us
                  </Link>
                  <Link
                    href="/features"
                    underline="hover"
                    sx={{ color: "black" }}
                  >
                    Features
                  </Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>
                    FAQ
                  </Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>
                    Terms & Conditions
                  </Link>
                  <Link href="#" underline="hover" sx={{ color: "black" }}>
                    Privacy Policy
                  </Link>
                </Stack>
              </Grid>

              {/* Our Mission */}
              <Grid item xs={10} sm={6} md={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  OUR MISSION
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                  Empowering smallholder farmers to remove carbon from the
                  atmosphere and promote sustainable, organic farming practices
                  for a healthier planet.
                </Typography>
              </Grid>
            </Grid>

            {/* Footer Bottom Bar */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              mt={5}
              px={2}
              py={2}
              sx={{
                borderTop: "1px solid #ccc",
                backgroundColor: "transparent",
              }}
            >
              <Typography variant="body2" sx={{ color: "white" }}>
                Designed and Developed by Visionary Minds
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                © 2024 AgroVihan. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
