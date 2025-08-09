<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output indent="yes" method="xml" encoding="UTF-8" omit-xml-declaration="yes" />

<xsl:template match="/">

<ProgramList>
 <Count>
   <xsl:value-of select="ProgramList/Count"/>
 </Count>
 <TotalAvailable>
   <xsl:value-of select="ProgramList/TotalAvailable"/>
 </TotalAvailable>

 <Programs>
    <xsl:for-each select="ProgramList/Programs/Program">

     <Program>
      <Title>
        <xsl:value-of select="Title"/>
      </Title>
      <SubTitle>
        <xsl:value-of select="SubTitle"/>
      </SubTitle>
      <Category>
        <xsl:value-of select="Category"/>
      </Category>
      <StartTime>
        <xsl:value-of select="StartTime"/>
      </StartTime>
      <EndTime>
        <xsl:value-of select="EndTime"/>
      </EndTime>
      <Description>
        <xsl:value-of select="Description"/>
      </Description>
      <Season>
        <xsl:value-of select="Season"/>
      </Season>
      <Episode>
        <xsl:value-of select="Episode"/>
      </Episode>

      <Channel>
        <ChanNum>
          <xsl:value-of select="Channel/ChanNum"/>
        </ChanNum>
        <ChannelName>
          <xsl:value-of select="Channel/ChannelName"/>
        </ChannelName>
      </Channel>

      <Recording>
        <Status>
          <xsl:value-of select="Recording/Status"/>
        </Status>
      </Recording>

     </Program>

    </xsl:for-each>

 </Programs>
</ProgramList>

</xsl:template>
</xsl:stylesheet>
