<%@ Page Language="vb" MaintainScrollPositionOnPostback="true" AutoEventWireup="false" Inherits="booth" CodeFile="booth.aspx.vb" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head22" runat="server">
      <title></title>
  </head>
	<body >
		<form id="booth" method="post" runat="server" enableviewstatemac="false" enableviewstate="true">
                    <asp:HiddenField ID="HiddenPassword" runat="server" />
                    <asp:HiddenField ID="PrimaryKeyID" runat="server" />

			<asp:Label id="Label_1_1" style="Z-INDEX: 102; LEFT: 30px; POSITION: absolute; TOP: 100px" runat="server"
			Width="231px"	Height="20px" Font-Names="Arial" Font-Size="12pt"  BackColor="Transparent" ForeColor="#000000" >this is a test of booth stuff</asp:Label>
        <asp:Button ID="Button1" style="Z-INDEX: 102; LEFT: 30px; POSITION: absolute; TOP: 180px" runat="server"
			Width="231px"	Height="40px" Font-Names="Arial" Font-Size="12pt" Text="Click here to Purchase" />
               </form>

	</body>
</html>
