import { ConfigProvider, Layout, Typography, Row, Col, Card, Button, Tag, theme } from 'antd'
import {
  ShoppingCartOutlined,
  GiftOutlined,
  CarOutlined,
  AppstoreOutlined,
  ShopOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import ruRU from 'antd/locale/ru_RU'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

interface PanelItem {
  key: string
  title: string
  description: string
  url: string
  icon: React.ReactNode
  tag: string
  tagColor: string
  color: string
}

const panels: PanelItem[] = [
  {
    key: 'chibbis',
    title: 'Chibbis',
    description: 'Заказы и товары с маркетплейса Chibbis. Синхронизация с МойСклад.',
    url: 'https://chibbis-production.up.railway.app/',
    icon: <ShoppingCartOutlined style={{ fontSize: 32 }} />,
    tag: 'Цветы',
    tagColor: 'green',
    color: '#52c41a',
  },
  {
    key: 'chibbis2',
    title: 'Chibbis (5 цветов)',
    description: 'Второй магазин на Chibbis — бренд «5 цветов». Отдельная интеграция.',
    url: 'https://frontend-chibbis2-production.up.railway.app/',
    icon: <ShoppingCartOutlined style={{ fontSize: 32 }} />,
    tag: '5 цветов',
    tagColor: 'cyan',
    color: '#13c2c2',
  },
  {
    key: 'flowwow',
    title: 'Flowwow',
    description: 'Заказы с маркетплейса Flowwow. Управление статусами и синхронизация.',
    url: 'https://zonal-curiosity-production-2157.up.railway.app/',
    icon: <GiftOutlined style={{ fontSize: 32 }} />,
    tag: 'Цветы',
    tagColor: 'magenta',
    color: '#eb2f96',
  },
  {
    key: 'yandex',
    title: 'Яндекс.Еда + Купер',
    description: 'Панель для управления заказами из Яндекс.Еда и Купер.',
    url: 'http://89.104.71.21/warehouse/',
    icon: <CarOutlined style={{ fontSize: 32 }} />,
    tag: 'Доставка',
    tagColor: 'orange',
    color: '#fa8c16',
  },
  {
    key: 'flawery',
    title: 'Флавери',
    description: 'Склад и заказы для бренда Флавери.',
    url: 'http://89.104.71.21/warehouse_flawery/',
    icon: <ShopOutlined style={{ fontSize: 32 }} />,
    tag: 'Склад',
    tagColor: 'purple',
    color: '#722ed1',
  },
  {
    key: 'kuper',
    title: 'Купер',
    description: 'Отдельная панель для заказов через Купер.',
    url: 'http://89.104.71.21/warehouse_kuper/',
    icon: <AppstoreOutlined style={{ fontSize: 32 }} />,
    tag: 'Доставка',
    tagColor: 'blue',
    color: '#1677ff',
  },
  {
    key: 'letu',
    title: 'Letu',
    description: 'Управление заказами через платформу Letu.',
    url: 'http://89.104.71.21/warehouse_letu/',
    icon: <ThunderboltOutlined style={{ fontSize: 32 }} />,
    tag: 'Доставка',
    tagColor: 'gold',
    color: '#faad14',
  },
  {
    key: 'turbocake',
    title: 'TurboCake',
    description: 'Панель заказов для TurboCake — торты и десерты.',
    url: 'http://89.104.71.21/warehouse_cake/',
    icon: <GiftOutlined style={{ fontSize: 32 }} />,
    tag: 'Еда',
    tagColor: 'volcano',
    color: '#fa541c',
  },
  {
    key: 'orders',
    title: 'Панель заказов',
    description: 'Общая панель для просмотра и управления всеми входящими заказами.',
    url: 'http://89.104.71.21/panel/',
    icon: <TeamOutlined style={{ fontSize: 32 }} />,
    tag: 'Операции',
    tagColor: 'geekblue',
    color: '#2f54eb',
  },
  {
    key: 'erp',
    title: 'ERP',
    description: 'Система управления ресурсами предприятия — аналитика и отчёты.',
    url: 'http://89.104.71.21/erp/',
    icon: <DatabaseOutlined style={{ fontSize: 32 }} />,
    tag: 'Аналитика',
    tagColor: 'lime',
    color: '#a0d911',
  },
]

export default function App() {
  const { token } = theme.useToken()

  return (
    <ConfigProvider locale={ruRU} theme={{ token: { colorPrimary: '#1677ff' } }}>
      <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
        <Header
          style={{
            background: '#fff',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <AppstoreOutlined style={{ fontSize: 22, color: token.colorPrimary }} />
          <Title level={4} style={{ margin: 0, lineHeight: 1 }}>
            Панели управления
          </Title>
        </Header>

        <Content style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 4 }}>Все интеграции</Title>
            <Text type="secondary">Выберите панель для перехода к управлению</Text>
          </div>

          <Row gutter={[20, 20]}>
            {panels.map((panel) => (
              <Col key={panel.key} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: 12,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  styles={{ body: { padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' } }}
                  onClick={() => window.open(panel.url, '_blank', 'noopener,noreferrer')}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: `${panel.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: panel.color,
                      marginBottom: 16,
                      flexShrink: 0,
                    }}
                  >
                    {panel.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Text strong style={{ fontSize: 16 }}>{panel.title}</Text>
                      <Tag color={panel.tagColor} style={{ margin: 0, fontSize: 11 }}>{panel.tag}</Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5 }}>
                      {panel.description}
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    ghost
                    block
                    style={{ marginTop: 16, borderColor: panel.color, color: panel.color }}
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(panel.url, '_blank', 'noopener,noreferrer')
                    }}
                  >
                    Открыть
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>

        <Footer style={{ textAlign: 'center', color: token.colorTextTertiary, fontSize: 12 }}>
          Панели управления © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}
