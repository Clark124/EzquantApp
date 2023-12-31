import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

export default function PrivacyPolicy({ route }) {

    return (
        <ScrollView style={styles.container}>
            <Text style={{textAlign:'center',fontSize:18,fontWeight:'bold'}}>
                经典战法隐私政策
            </Text>
            <Text>
                上海谱数科技有限公司（以下简称“经典战法”或“我们”）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。同时，我们承诺，我们将按业界成熟的安全标准，采取相应的安全保护措施来保护您的个人信息。
            </Text>
            <Text>
                请您在使用我们的产品（或服务）前，仔细阅读并确认本《隐私政策》。本政策是我司统一使用的一般性隐私条款，适用于我司所有产品和服务。
            </Text>

            <Text>本政策将帮助您了解以下内容：</Text>
            <Text>1．我们如何收集和使用您的个人信息</Text>
            <Text>2．我们如何使用 Cookie 和同类技术</Text>
            <Text>3．我们如何共享、转让、公开披露您的个人信息</Text>
            <Text>4．我们如何保护您的个人信息</Text>
            <Text>5．我们如何处理未成年人提供的个人信息</Text>
            <Text>6．您分享的信息</Text>
            <Text>7．本政策如何更新</Text>
            <Text>8．如何联系我们</Text>
            <Text>一. 我们如何搜集和使用您的信息？</Text>
            <Text>1. 我们如何搜集您的信息？</Text>
            <Text>我们提供服务时，可能会收集、储存和使用下列信息：</Text>
            <Text>1.1 您提供的信息</Text>
            <Text>1.1.1 您在注册账户或使用我们的服务时，向我们提供的相关个人信息，例如您的姓名、电子邮件地址、电话号码、住址、身份证号码等信息。如果您想充分使用我们提供的各种分享功能，可能还需要创建公开显示的个人资料，其中可能会包含您的姓名和照片。</Text>
            <Text>1.1.2 您通过我们的服务向其他方提供的共享信息，以及您使用我们的服务时上传、提交、存储、发送或接收的信息。</Text>
            <Text>1.2 您在使用服务过程中，我们获取的信息
                我们会收集您使用的服务以及使用方式的信息，如您何时在经典战法观看了视频，何时访问了我们的广告服务，或何时查看了我们的广告和内容。此类信息包括：</Text>
            <Text>1.2.1 设备信息：我们会读取收集设备专用的信息，例如您的AndroidID、IP地址、MAC地址、IMEI、OAID、IMSI、应用列表、硬件型号、操作系统信息、移动设备版本、设备识别码、屏幕分表率等信息。</Text>
            <Text>1.2.2 日志信息</Text>
            <Text>A. 设备或软件信息，例如您的移动设备、网页浏览器或用于接入我们服务的其他程序所提供的配置信息、您的IP地址和移动设备所用的版本和设备识别码；</Text>
            <Text>B. 在使用我们服务时搜索或浏览的信息，例如您使用的网页搜索词语、访问的社交媒体页面url地址，以及您在使用我们服务时浏览或要求提供的其他信息和内容详情；</Text>
            <Text>1.2.3 IP地址</Text>
            <Text>A. 有关您曾使用的移动应用（APP）和其他软件的信息，以及您曾经使用该等移动应用和软件的信息；</Text>
            <Text>B. 您通过我们的服务进行通讯的信息，例如曾通讯的账号，以及通讯时间、数据和时长；</Text>
            <Text>C. 您通过我们的服务分享的内容所包含的信息（元数据），例如拍摄或上传的共享照片或录像的日期、时间或地点等。</Text>
            <Text>2. 我们如何使用您的信息</Text>
            <Text>我们可能将上述收集的信息用作以下用途：</Text>
            <Text>2.1 向您提供服务；</Text>
            <Text>2.2 在我们提供服务时，用于身份验证、客户服务、安全防范、诈骗监测、存档和备份用途，确保我们向您提供的产品和服务的安全性；</Text>
            <Text>2.3 帮助我们设计新服务，改善我们现有服务；</Text>
            <Text>2.4 使我们更加了解您如何接入和使用我们的服务，从而针对性地回应您的个性化需求，例如语言设定、位置设定、个性化的帮助服务和指示，或对您和其他用户作出其他方面的回应；</Text>
            <Text>2.5 向您提供与您更加相关的广告以替代普遍投放的广告；</Text>
            <Text>2.6 评估我们服务中的广告和其他促销及推广活动的效果，并加以改善；</Text>
            <Text>2.7 执行软件验证、升级服务；</Text>
            <Text>2.8 应用户特殊要求而提供特定服务时，需要将信息提供给我们的关联公司、第三方或其他用户；</Text>
            <Text>2.9 其他有利于用户和经典战法运营者利益且不违反任何强制性法律法规的情况。</Text>
            <Text>2.10 让您参与有关我们产品和服务的调查</Text>
            <Text>3. 我们承诺</Text>
            <Text>3.1 我们不会根据敏感类别（例如种族、宗教、性取向或健康状况）向您展示个性化广告；</Text>
            <Text>3.2 我们不会与广告主分享可用于识别您个人身份的信息，例如您的姓名或电子邮件地址（除非经您授权同意）；</Text>
            <Text>3.3 在任何时候、任何情况下都不会向任何第三方出售您的个人信息，我们只会在法律允许的范围内使用根据本协议获得的信息。我们会制定严格的政策保护您的个人信息，除非事先获得您的授权或本声明另有规定之外，不会将您的这些信息对外公开或向第三方提供。</Text>
            <Text>4. 为保证服务质量，我们可能会由关联公司或其他可信合作单位向您提供您所要求的服务或您可能感兴趣的内容。您同意我们向关联公司或合作单位分享该产品、服务所必须的个人信息。我们会要求关联公司及合作单位按照我们的说明、隐私政策以及任何其他适当的保密和安全措施来保证您的个人信息安全。除此之外，我们不会向任何第三方提供或分享您的信息。</Text>
            <Text>5. 我们不会将您的个人信息转移或披露给任何非关联的第三方，除非：</Text>
            <Text>5.1 相关法律法规、法律程序、政府机关的强制性要求；</Text>
            <Text>5.2 为完成合并、分立、收购或资产转让而转移；</Text>
            <Text>5.3 事先获得您的授权；</Text>
            <Text>5.4 您使用共享功能；</Text>
            <Text>5.5 以学术研究或公共利益为目的；</Text>
            <Text>5.6 在法律法规和政策允许的范围内，为提升用户体验和提供个性化的推广服务；</Text>
            <Text>5.7 我们认为必要且不违反法律强制性规定的其他情形。</Text>
            <Text>6. 除非经过您的同意，否则我们不会向任何人提供您的敏感个人信息。</Text>
            <Text>二、我们如何使用 Cookie 和同类技术</Text>
            <Text>收集哪些信息以及如何使用这些信息？经典战法使用 cookie 、标签和脚本等技术。这些技术用于分析趋势、管理网站、追踪用户的网站活动。
                日志文件：和大部分网站一样，我们收集特定信息并保存在日志文件中。 此类信息可能包括互联网协议 (IP) 地址、浏览器类型、互联网产品和服务供应商 (ISP)、引用/退出页面、操作系统、日期/时间戳和/或点击流数据。我们不会将自动收集的数据链接到我们收集的关于您的其他信息之中。</Text>

            <Text>广告：我们与第三方产品和服务供应商合作，在我们的网站上展示广告或管理我们在其他网站上的广告。我们的第三方产品和服务供应商可能会使用诸如 cookie 等技术来收集您在其网站或其他网站上的活动信息，以根据您的浏览活动和兴趣为您提供广告。我们会在向您提供广告产品和服务之前，通过清晰的主动行为获取您事前的明确同意。 如果不希望该信息被用于根据您的兴趣投放广告，可以通过2542855823@qq.com联系我们，以便我们处理您的特殊需求。</Text>
            <Text>三、我们如何共享、转让、公开披露您的个人信息</Text>
            <Text>（一）共享</Text>
            <Text>我们不会与本公司以外的任何公司、组织和个人分享您未脱敏的个人信息。目前，我们会在以下情形中，向您征求您对共享敏感个人信息的授权同意：</Text>
            <Text>1、与我们的关联方和第三方产品和服务供应商共享敏感信息。为了顺利地从事商业经营，以向您提供产品和服务的全部功能，我们可能不时向我们的关联公司（其涉及教育咨询等公司）或我们的第三方产品和服务供应商（我们的产品和服务供应商、数据存储设施、客户产品和服务供应商、广告和营销产品和服务供应商）[关联公司和/或其他第三方]（统称为“第三方产品和服务供应商”）披露您的个人敏感信息。 此类第三方产品和服务供应商可能代表经典战法或出于上述的一项或多项目的处理您的个人敏感信息。如果您不再希望允许我们共享您的个人信息，请发送电子邮件到2542855823@qq.com联系我们。</Text>
            <Text>以上信息的共享，我们均会将您的信息进行脱敏和加密处理，保证使用方式和用途的合法性。</Text>
            <Text>2、基于协议约定：依据您与我们签署的相关协议（包括在线签署的电子协议及相关规则）或其他法律文件，有必要向第三方共享。</Text>
            <Text>（二）转让</Text>
            <Text>我们不会将您的未脱敏个人信息转让给任何公司、组织和个人，但以下情况除外：</Text>
            <Text>1、在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；</Text>
            <Text>2、在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会在要求新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。</Text>

            <Text>（三）公开披露</Text>
            <Text>我们仅会在以下情况下，公开披露您的个人信息：</Text>
            <Text>1、获得您明确同意后；</Text>
            <Text>2、基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的未脱敏个人信息。</Text>

            <Text>四、我们如何保护您的个人信息</Text>
            <Text>我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合理可行的措施，保护您的个人信息。例如，当您访问经典战法账户时，您可以选择我们的验证程序来保证更好的安全性。</Text>
            <Text>（一）我们会采取一切合理可行的措施，确保未收集无关的个人信息。我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非需要延长保留期或受到法律的允许；超出上述个人信息保存期限后，我们将对您的个人信息进行删除或匿名化处理。</Text>
            <Text>（二）您的个人信息全都被储存在安全的产品和服务器上，并在受控设施中受到保护。我们依据重要性和敏感性对您的数据进行分类，并且保证您的个人信息具有最高的安全等级。我们保证通过访问这些信息来帮助向您提供产品和服务的员工和第三方产品和服务供应商具有严格的合同保密义务，如果未能履行这些义务，其将会受到纪律处分或被终止合作。总之，我们定期审查信息收集、储存和处理实践，以防止任何未经授权的访问和使用</Text>
            <Text>（三）互联网环境并非百分之百安全，我们将尽力确保或担保您发送给我们的任何信息的安全性。如果我们的物理、技术、或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改、或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。</Text>
            <Text>（四）在不幸发生个人信息泄露事件后，我们将按照法律法规的要求，及时向您告知：泄露事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。</Text>
            <Text>同时，我们还将按照监管部门要求，主动上报个人信息泄露事件的处置情况。</Text>

            <Text>五、我们如何处理未成年人提供的个人信息</Text>
            <Text>我们非常重视未成年人信息的保护。我们只会在法律允许的范围内，或依当地法律取得监护人的同意，或是为了保护未成年人而使用或披露有关未成年人的个人数据。“未成年人”的定义应考虑适用的法律以及各国家和地区的文化惯例。</Text>

            <Text>六、您的权利</Text>
            <Text>按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，我们保障您对自己的个人信息行使以下权利：</Text>
            <Text>（一）访问您的个人信息</Text>
            <Text>您有权访问您的个人信息，法律法规规定的例外情况除外。如果您想行使数据访问权，可以通过以下方式自行访问：</Text>
            <Text>1、您不应当向任何人披露您的登录密码或帐户信息，否则产生的责任由您承担。无论您何时作为经典战法帐号用户登录经典战法，尤其是在他人的计算机或公共互联网终端上登录时，在会话结束时您应当选择退出登录。</Text>
            <Text>您无法通过上述方式访问这些个人信息，您可以随时向2542855823@qq.com发送邮件的方式联系我们，我们将在15天内回复您的访问请求。</Text>
            <Text>2、经典战法不对因您未能保持个人信息的私密性而导致第三方访问您的个人信息进而造成的安全疏漏承担责任。尽管有上述规定，如果发生互联网其他任何用户未经授权使用您帐户的情况或其他任何安全漏洞，您必须立即通知我们。您的协助将有助于我们保护您个人信息的私密性。</Text>
            <Text>（二）更正您的个人信息</Text>
            <Text>当您发现我们处理的关于您的个人信息有错误时，您有权要求我们作出更正。您可以通过“（一）访问您的个人信息”中罗列的方式提出更正申请。</Text>
            <Text>如果您无法通过上述方式更正这些个人信息，您可以随时向2542855823@qq.com发送邮件的方式联系我们，我们将在15天内回复您的更正请求。</Text>
            <Text>（三）改变您授权同意的范围</Text>
            <Text>每个业务功能需要一些基本的个人信息才能得以完成。对于额外收集的个人信息的收集和使用，您可以随时给予或收回您的授权同意。</Text>
            <Text>（四）响应您的上述请求</Text>
            <Text>为保障安全，您可能需要提供书面请求，或以其他方式证明您的身份。我们可能会先要求您验证自己的身份，然后再处理您的请求。我们将在15天内作出答复。如您不满意，还可以通过以下途径投诉：2542855823@qq.com。</Text>
            <Text>对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际（例如，涉及备份磁带上存放的信息）的请求，我们可能会予以拒绝。</Text>
            <Text>在以下情形中，我们将无法响应您的请求：</Text>
            <Text>1、与个人信息控制者履行法律法规规定的义务相关的；</Text>
            <Text>2、与国家安全、国防安全直接相关的；</Text>
            <Text>3、与公共安全、公共卫生、重大公共利益直接相关的；</Text>
            <Text>4、与犯罪侦查、起诉、审判和执行判决等直接相关的；</Text>
            <Text>5、个人信息控制者有充分证据表明个人信息主体存在主观恶意或滥用权利的；</Text>
            <Text>6、出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</Text>
            <Text>7、响应个人信息主体的请求将导致个人信息主体或其他个人、组织的合法权益受到严重损害的；</Text>
            <Text>8、涉及商业秘密的。</Text>
            <Text>七.本政策的更新</Text>
            <Text>我们可能会不定期修改、更新本隐私政策，有关隐私政策的更新，我们会在本页面上发布对本政策所做的任何变更。对于重大变更，我们会向您发出郑重通知（包括对于某些服务，我们会通过电子邮件发送通知，说明对隐私政策进行的更改）。</Text>
            <Text>八. 如何联系我们</Text>
            <Text>如果您对本隐私政策有任何疑问、意见或建议，请联系我司客服：2542855823@qq.com</Text>
            <Text>感谢您花时间了解我们的隐私政策！</Text>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:15
    },

});
